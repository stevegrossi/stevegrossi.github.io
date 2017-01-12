---
layout: post
title: "Using Ecto Schemas with Database Views"
tags:
  - elixir
  - sql
---

Database views are a great way to provide a simplified abstraction over complicated data logic. They provide a way to treat a complex query as if it were a simple table, and with no extra work, you can build Ecto schemas on top of database views to bring the power of that abstraction into your Elixir code!

<!--more-->

In a side project of mine, an Elixir/Phoenix app for tracking daily habits called (imaginatively) [Habits](https://github.com/stevegrossi/habits), the most complicated data logic involves figuring out "streaks" of check-ins. You can check in to a habit (i.e. record that you've done it) once each day, and a streak is the number of days in a row that you’ve checked in. The intention—based on Jerry Seinfeld's “don’t break the chain” motivational strategy—is that if I see that I’ve flossed 100 days in a row, I’m more likely to floss on the 101st.

I don’t store "streaks" as a unique thing in the database. I only store habits and check-ins, but the database can figure out and tell us the streaks if we ask nicely. Unfortunately, asking nicely looks like this:

```sql
WITH start_streak AS (
  SELECT
    check_ins.date,
    check_ins.habit_id,
    CASE WHEN check_ins.date - LAG(check_ins.date, 1) OVER (PARTITION BY check_ins.habit_id ORDER BY check_ins.date) > 1
      THEN 1
      ELSE 0
    END streak_start
  FROM check_ins
  ),
  streak_groups AS (
    SELECT
      date,
      habit_id,
      SUM(streak_start) over (PARTITION BY habit_id ORDER BY date) streak
    FROM start_streak
  )
SELECT
  habit_id,
  MIN(date) AS start,
  MAX(date) AS end,
  MAX(date) - MIN(date) + 1 AS length
FROM streak_groups
GROUP BY habit_id, streak
```

For the purpose of this post, it doesn’t really matter what the query above is doing, only that it returns data that looks like this:

```
habit_id |   start    |    end     | length
----------+------------+------------+--------
       5 | 2014-04-23 | 2014-04-24 |      2
       6 | 2015-12-05 | 2015-12-09 |      5
       3 | 2013-07-25 | 2013-07-25 |      1
       2 | 2015-09-23 | 2015-09-24 |      2
       8 | 2014-09-26 | 2014-09-29 |      4
       5 | 2013-09-22 | 2013-09-22 |      1
       6 | 2015-09-20 | 2015-09-24 |      5
       8 | 2014-12-04 | 2014-12-04 |      1
       8 | 2016-10-23 | 2016-10-26 |      4
       5 | 2014-02-10 | 2014-02-10 |      1
```

For every "streak", it tells me which habit it belongs to (which makes it easy to query streaks for a given habit), when the streak started, ended, and how many days it lasted. Awesome! *Except* that if I want to use this data in an Elixir function—perhaps to query the longest streak for habit—I have to copy and paste this big ball of SQL into an `.ex` file, manually set up `join()`s, etc. Wouldn’t it be great if Ecto could just treat streak data with the same elegant interface I can use with `Habit`s and `CheckIn`s? Happily, it can!

## Creating the View with a Migration

The first step is actually creating the view in the database. This requires some SQL like `CREATE VIEW my_view AS` followed by your query, which can be accessed with the name `my_view`. As with any database changes, we'll make this with a migration:

```
$ mix ecto.gen.migration create_streaks_view
```

This will create a file in `priv/repo/migrations`. Unfortunately, there aren’t yet any great tools like Thoughtbot's [scenic](https://github.com/thoughtbot/scenic) library for Rails that make working with database views easier in Ecto. So we're going to have to write some SQL, but this is the only time. We can run raw SQL in migrations by using the `execute` function.

Because different SQL is required for creating and destroying database views, we'll need separate `up` and `down` functions defined, instead of the default `change`. The migration will look something like this (see the entire file [on Github](https://github.com/stevegrossi/habits/blob/master/priv/repo/migrations/20170111012241_add_streaks_view.exs)):

```elixir
defmodule Habits.Repo.Migrations.AddStreaksView do
  use Ecto.Migration

  def up do
    execute """
    CREATE VIEW streaks AS
      --- the SQL from above, omitted for brevity
    ;
    """
  end

  def down do
    execute "DROP VIEW streaks;"
  end
end
```

Finally, running `mix ecto.migrate` will create our `streaks` view in the database. With that, we can query the `streaks` view as if it were any other table:

```sql
SELECT habits.name, MAX(streaks.length)
FROM habits
INNER JOIN streaks ON streaks.habit_id = habits.id
GROUP BY habits.id;

          name           | max
-------------------------+-----
 Write in Journal        |   5
 Evening Stretches       |  45
 Floss                   | 607
 Morning Stretches       |  27
 Exercise                |  14
```

(Elixir: great for oral hygiene!) Of course, I did say above that we wouldn’t need to write any more raw SQL. Since database views behave a lot like tables, let’s see what Ecto schemas can do for us.

## View-Backed Ecto Schemas

There's actually nothing you need to do differently! By default Ecto’s `schema` macro can use the name of a database view just like a table, and allow the full range of type declarations and associations:

```elixir
defmodule Habits.Streak do
  use Habits.Web, :model

  @primary_key false
  schema "streaks" do
    belongs_to :habit, Habit
    field :start, :date
    field :end, :date
    field :length, :integer
  end
end
```

I've set `@primary_key false` because my `streaks` view doesn’t have a primary key (such as `id`, which Ecto will expect by default). However, this line won’t be necessary for views with an `id` column.

As with any schema module, this new `Habits.Streak` module is a great place to encapsulate logic related to streak data, such as finding the longest streak:

```elixir
defmodule Habits.Streak do
  # schema, etc.

  def longest(queryable \\ __MODULE__) do
    queryable
    |> select([s], max(s.length))
    |> Repo.one
  end
end
```

to be used like so:

```elixir
iex> Streak.longest
607
```

or, after setting up a `has_many :streaks, Streak` association in the `Habit` schema:

```elixir
iex> Repo.get(Habit, 1)
...> |> Ecto.assoc(:streaks)
...> |> Streak.longest
5
```

For context, I put the entire set of changes into a pull request, which you can see here: [github.com/stevegrossi/habits/pull/4](https://github.com/stevegrossi/habits/pull/4)

## Further Reading

Database views are effectively subqueries: they’re run each time you call them. If necessary, you can have the database cache the results of a view using something called a “materialized view”. Learn more about using those with Ecto in [this post by Sylvain Kieffer](https://medium.com/@kaisersly/materialized-views-in-ecto-8887bc89efa5).
