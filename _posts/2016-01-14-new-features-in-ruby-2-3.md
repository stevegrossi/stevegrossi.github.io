---
layout: post
title: New Features in Ruby 2.3
tags:
  - ruby
---

Ruby 2.3 was [released on Christmas day](https://www.ruby-lang.org/en/news/2015/12/25/ruby-2-3-0-released/) so I'm a little late to the party, but I recently gave a talk at [my local Ruby meetup](http://indyrb.org/) about some nifty new additions to the language. (Many of them I learned about while preparing for the talk—success!) Here's what I'm excited about.

<!--more-->

## Hash#fetch_values

    hash = { puppies: "Cute", kittens: "Adorbs", turtles: "LOL" }

    # Hash#fetch lets us grab one value and blows up if we typo
    hash.fetch(:puppies) #=> "Cute"
    hash.fetch(:pupies) #=> KeyError: key not found: :pupies

    # And Hash.values_at is a neat way to grab multiple values
    hash.values_at(:puppies, :turtles) #=> ["Cute", "LOL"]

    # But it just returns nil if we typo.
    hash.values_at(:pupies, :turtles) #=> [nil, "LOL"]

    # With 2.3, we now have Hash#fetch_values which combines both!
    hash.fetch_values(:puppies, :turtles) #=> ["Cute", "LOL"]
    hash.fetch_values(:pupies, :turtles) #=> KeyError: key not found: :pupies

## A new pragma (magic comment) to enable frozen strings by default

    # Just one example of why it's cool to freeze strings
    CONSTANT = "Steve"
    CONSTANT #=> "Steve"
    steve = CONSTANT
    steve << " Grossi"
    CONSTANT #=> "Steve Grossi" # LOLGUESSNOT

    # Freeze lets us specify objects as "Should not change"
    CONSTANT = "Steve".freeze
    steve = CONSTANT  #=> "Steve"
    steve << " Grossi" #=> RuntimeError: can't modify frozen String

    # It also saves memory

    # 1000 objects for the same string 1000 times!
    1000.times.map{ "Steve".object_id }.uniq.size #=> 1000

    # Just 1 object! Handy if you refer to strings a lot.
    1000.times.map{ "Steve".freeze.object_id }.uniq.size #=> 1

    # It's opt-in for now. Add this to the top of a .rb file:
    # frozen_string_literal: false

    # Word is this will be default in Ruby 3, so be prepared!

## Enumberable#grep_v

    # Say you've got an array of things:
    peeps = [Steve.new, Miles.new, Dave.new]

    # Before, you could filter out only the Steves like so:
    # Enumberable#grep compares with ===
    peeps.grep Steve #=> [#<Steve:0x007fb8b9186a90>]

    # But what if (for some crazy reason) you wanted only the non-Steves?
    # Now you can!
    peeps.grep_v Steve #=> [#<Miles:0x007fb8b9186a18>, #<Dave:0x007fb8b9186a15>]

    # It works with regexes, too:
    ["Steve", "Miles", "Dave"].grep_v /Dave/ #=> ["Steve", "Miles"]

    # I think it stands for inVert or something...

## Hash comparison operators

    some = { a: 1 }
    most = { a: 1, b: 2 }
    all  = { a: 1, b: 2, c: 3 }
    wat  = { puppies: "Cute" }

    # Subsets: <= and >=
    most >= some #=> true
    most <= most #=> true

    # Proper Subsets: < and >
    most > some #=> true
    most < most #=> false

    # Always false if no comparison
    most >= wat #=> false
    some < wat #=> false

## Hash#dig (and Array#dig)

    # Imagine you get some data
    data = { user: { name: "Steve", address: { street: "1 Awesome Lane"}}}

    # We want the street
    data[:user][:name][:street] #=> "1 Awesome Lane"

    # But what if the data is bad? Esplode!
    bad_data = { user: nil }
    bad_data[:user][:name][:street] #=> undefined method `[]' for nil:NilClass

    # Previously, we needed to guard against that. Yuck:
    data[:user] && data[:user][:name] && data[:user][:name][:street] #=> "1 Awesome Lane"
    bad_data[:user] && bad_data[:user][:name] && bad_data[:user][:name][:street] #=> nil

    # Now, we can dig!
    data.dig(:user, :address, :street) #=> "1 Awesome Lane"
    bad_data.dig(:user, :address, :street) #=> nil

# Hash#to_proc

    # Now you can call hashes on things!
    # It returns the value of the thing's key in the hash:
    comments = {
      "A" => "Great jerb!",
      "B" => "Not bad!",
      "C" => "Meh.",
      "D" => "Pick it up...",
      "F" => "Sorry, try again."
    }

    report_card = ["A", "A", "B", "D"]
    report_card.map(&comments)
    #=> ["Great jerb!", "Great jerb!", "Not bad!", "Pick it up..."]

    # It returns nil for unrecognized inputs
    weird_report_card = ["A", nil, "Z"] #=> ["Great jerb!", nil, nil]
    weird_report_card.map(&comments)

## Numeric#positive? and Numeric#negative?

    # Ugh, so mathy!
    -1 < 0 #=> true

    # Ah, that's better
    -1.negative? #=> true

    # But srsly, having a predicate method is handy for selection
    numbers = -3..3

    numbers.select(&:positive?) #=> [1, 2, 3]
    numbers.select(&:negative?) #=> [-3, -2, -1]

# The squiggly Heredoc

    # Heredocs let us span strings over multiple lines
    animals = <<-ANIMALS
      Puppies
      Kittens
      Turtles
      Those little piggy things
    ANIMALS

    # But they include all that unsightly whitespace
    animals.split("\n").first #=> "  Puppies"

    # ActiveSupport gave us strip_heredoc, but with a seperate library (or Rails)
    animals = <<-ANIMALS.strip_heredoc
      Puppies
      Kittens
      Turtles
      Those little piggy things
    ANIMALS

    animals.split("\n").first #=> "Puppies"

    # But now Ruby gives us THE SQUIGGLY HEREDOC
    animals = <<~ANIMALS
      Puppies
      Kittens
      Turtles
      Those little piggy things
    ANIMALS

    animals.split("\n").first #=> "Puppies"

## The safe navigation operator for nested objects

    require "ostruct"

    steve = OpenStruct.new(
      name: "Steve",
      address: OpenStruct.new(
        street: "1 Awesome Lane"
      )
    )

    khal = OpenStruct.new(
      name: "Khal Drogo",
      address: nil # He kinda wanders...
    )

    steve.address.street #=> "1 Awesome Lane"
    khal.address.street #=> NoMethodError: undefined method `street' for nil:NilClass

    # So we used to have to do
    steve && steve.address && steve.address.street #=> "1 Awesome L
    khal && khal.address && khal.address.street #=> nil

    # But now we can:
    steve&.address&.street #=> "1 Awesome Lane"
    khal&.address&.street #=> nil

    # R.I.P. Khal Drogo, though I guess it’s too late for that...
