---
title: Testing current_user In a Phoenix App the Easy Way
tags:
  - elixir
  - phoenix
  - testing
---

One of the things that’s drawn me to Elixir is how well it lends itself to test-driven development. But while testing a controller action in an Elixir application using Phoenix, I ran into a problem familiar from Ruby/Rails: how to test a controller action that requires authentication, i.e. that requires a `current_user` present.

<!--more-->

In Rails (with RSpec) I would typically stub the `current_user` method on the controller to return a user I create and provide:

```ruby
test "lists all entries on index" do
  user = FactoryGirl.build_stubbed(:user)
  allow(controller).to receive(:current_user).and_return(user)

  # the rest of the test
end
```

And so this was my first approach in Elixir. I found a mocking library appropriately named [mock](https://github.com/jjh42/mock) and added it to my Mix file for the test environment:

```elixir
{:mock, "~> 0.1", only: :test}
```

With this, I could write a test similar to the Ruby example above: mocking the `Dayli.Session` module (Dayli being the name of my app, a habit-tracker) and stubbing the `current_user` function to return a user I’ve set up myself:

```elixir
test "lists all entries on index", %{conn: conn} do
  user = Factory.create(:user)
  goal = Factory.create(:goal, user: user)

  with_mock Dayli.Session, [
    current_user: fn(_conn) -> user end,
    logged_in?:   fn(_conn) -> true end
  ] do
    conn = get conn, goal_path(conn, :index)

    assert html_response(conn, 200) =~ goal.name
  end
end
```

However, as you can see I also needed to stub the `logged_in?` function, so this isn’t as clean as I’d like, especially considering that almost every one of my controller tests would need to duplicate the 4-line `with_mock` call.

So I did a bit of searching online and came across a provocative (in his charming way) tweet by José Valim, creator of Elixir, coming out strongly against mocks and stubs:

> I will fight against mocks, stubs, and YAML in Elixir with all my... friendliness and energy to promote proper education on those topics.
>
> José Valim, creator of Elixir, [on Twitter](https://twitter.com/josevalim/status/641617411242913792)

This convinced me that there had to be a better way, and indeed there was! Some further searching led me to [this StackOverflow answer](http://stackoverflow.com/questions/31983077/how-can-i-set-session-in-setup-when-i-test-phoenix-action-which-need-user-id-in) which pointed out the obvious: because `conn` (the connection struct) is just a data structure, I could simply set the current user in my tests the same way I do in the application, with `assign`:

```elixir
test "lists all entries on index", %{conn: conn} do
  user = Factory.create(:user)
  goal = Factory.create(:goal, user: user)

  conn = conn()
    |> assign(:current_user, user)
    |> get(goal_path(conn, :index))

  assert html_response(conn, 200) =~ goal.name
end
```

The 1-line `conn |> assign(:current_user, user)` is much cleaner, and has the benefit of letting my tests more closely mimic the actual application behavior, making them more reliable.
