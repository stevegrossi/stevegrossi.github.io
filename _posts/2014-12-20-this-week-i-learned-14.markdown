---
title: 'This Week I Learned #14'
date: 2014-12-20 07:54 EST
tags:
  - ruby
  - sql
---

How to handle advanced command-line arguments with Ruby's `OptionParser`, and efficiently copying data between tables with raw SQL.

<!--more-->

## Powering Up Command-line Scripts with Ruby's `OptionParser`

This week, I've been doing load testing with [Apache JMeter](http://jmeter.apache.org/) and built a command-line interface in Ruby to simplify running load tests. JMeter is useful in that it doesn't just hammer a single URL with requests. Rather, it functions like a concurrent browser, simulating real users visiting, logging into, and interacting with your app in real-world use cases. As such, my CLI would need to provide JMeter with an email and password to use. I wanted to avoid hard-coding these values, both for security and flexibility, so the best option seemed to be allowing them as arguments to my Ruby scripe as I'd seen done with other command-line tools. It would look something like:

    $ ./jmeter.rb -u test@example -p passw0rd

It turns out that Ruby ships with a simple, powerful library for accepting command line arguments. First, you require the library and configure your default options:

    require 'optparse'

    # Default options
    options = {
      debug: false,
      users: 20
    }

Then, `OptionParser.new` takes a block for manipulating the options passed in. The basic syntax is `.on('-shortcut', '--full-command INPUT_TYPE', 'Description') do |value|`.

    OptionParser.new do |opts|

      # Includes a handy way to automatically list available options
      opts.banner = 'Usage: jmeter.rb [options]'
      opts.on('-h', '--help', 'Show this message') do
        puts opts
        exit
      end

      # Parse options with provided values
      opts.on('-e', '--email EMAIL', 'Email (required)') do |opt|
        options[:email] = opt
      end
      opts.on('-p', '--password PASSWORD', 'Password (required)') do |opt|
        options[:password] = opt
      end
      
      # Parse boolean flags
      opts.on('--debug', 'Debug (JMeter GUI)') do
        options[:debug] = true
      end

    end.parse!

To make some options required, check for them and raise an error if they're not set:

    unless options[:email] && options[:password]
      raise OptionParser::MissingArgument, 'Email and password are required'
    end

In the rest of your program, simply access your default options, merged with user-provided options, through the `options` hash, as in `options[:email]`.

## Copying Data from one Table to Another with SQL

This week, I found myself faced with a big model which was doing two unrelated things. At work we have an `Assignment` model which handles users being assigned lessons, but it was also keeping track of their progress on those lessons. Following the first [SOLID design principle](http://en.wikipedia.org/wiki/SOLID_%28object-oriented_design%29), the single responsibility principle, these concerns really should be handled by separate models, so I decided to split users' progress into its own `Progress` model.

I then needed a migration to copy all of the progress-related data from the assignments table into the new progresses table, but doing so through ActiveRecord proved prohibitively slow for tens of thousands of records:

    Assignment.find_each do |assignment|
      Progress.create!(
        started_at:   assignment.started_at,
        completed_at: assignment.completed_at,
        score:        assignment.score,
        user_id:      assignment.user_id,
        lesson_id:    assignment.lesson_id
      )
    end

Fortunately, it isn't too difficult or ugly to copy data directly like this with SQL. In the migration's `up` method, I populated the brand new progresses table with an `INSERT INTO` statement.

    INSERT INTO progresses
      (started_at,
       completed_at,
       score,
       user_id,
       lesson_id)
    SELECT started_at,
           completed_at,
           score,
           user_id,
           lesson_id
    FROM assignments

Happily, this migration completed in under a second. Now, for the migration's `down` method, I'd need to do the reverse, pulling data out of the progresses table and back into assignments. `INSERT INTO` adds new rows, so it wouldn't work for updating columns in existing rows. For that, I turned to `UPDATE` coupled with `FROM`, using a `WHERE` statement to match the corresponding columns by their user and lesson:

    UPDATE assignments
    SET started_at   = progresses.started_at,
        completed_at = progresses.completed_at,
        score        = progresses.score
    FROM progresses
    WHERE progresses.lesson_id = assignments.lesson_id
      AND progresses.user_id   = assignments.assignee_id
