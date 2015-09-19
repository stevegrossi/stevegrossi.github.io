---
title: Collaborative Coding with Exercism.io
date: 2014-06-20 15:54 EDT
tags:
  - ruby
  - learning
---

[Exercism.io](http://exercism.io/) is a tool for giving and getting feedback on code. It provides you with a series of exercises in your languages of choice, you solve them as elegantly as you can, and you submit them for feedback from others while giving others feedback in kind. In doing just one exercise, I found that it challenged me to reflect deeply about why I prefer some coding idioms to others, and in critiquing my own and others' code, I was happy to learn a few new things about Ruby.

<!--more-->

## My First Exercise

Exercism.io has a web interface for providing feedback which you can log in to with Github, but one's main interactions with Exercism.io happen on the command line. There's a handy one-liner for installing the <abbr title="Command-line Interface">CLI</abbr> which [can be found here](http://help.exercism.io/installing-the-cli.html).

After running `exercism login`, you fetch the first exercises with `exercism fetch`. This grabs the initial exercise for each of the dozen-or-so supported languages. I chose Ruby, the first exercise for which involved a simple-enough task: calculating the Hamming distance (the number of differing characters) between two strings. Exercism.io enforces a <abbr title="Test-Driven Development">TDD</abbr> approach, which I was right at home with. You get a suite of 9 tests (with all but the first one `skip`ped) and proceed by building a class which gets all of them to pass. For example, the first test is:

    def test_no_difference_between_identical_strands
      assert_equal 0, Hamming.compute('A', 'A')
    end

Which requires you to define a `Hamming` class with a `#compute` method that receives two arguments and returns 0. I find it most useful to write the simplest construct that will make the test pass, so I began with

    class Hamming
      def self.compute(str1, str2)
        0
      end
    end

Of course, the rest of the tests revealed that my class would need to do much more than this. My first attempt which passed all of the tests was:

    class Hamming
      def self.compute(sequence1, sequence2)
        differences = 0
        sequence1.chars.each_with_index do |char, i|
          break unless sequence2[i]
          differences += 1 if char != sequence2.chars[i]
        end
        differences
      end
    end

But there were a few things I didn't like about this:

* Assigning a `differences` variable, modifying it, and then returning it seemed too much like PHP to me. Ruby surely had a more elegant way.
* There was a certain *asymmetry* that didn't seem right. Why are we only looping over `sequence1`, but only breaking if something is true about `sequence2`? (It's to only compare positions in the strings where both actually have a letter, but this code hardly makes that clear.)

Sensing that I was thinking too much like a computer, I took another approach which began by thinking "How would I do this as a human?" Well, I would look at pairs of characters, one at a time from each sequence, and count each time they differed. Hence, my second approach:

    class Hamming

      def self.compute(sequence1, sequence2)
        comparisons = sequence1.chars.zip(sequence2.chars)
        comparisons.inject(0) do |differences, comparison|
          differences += calculate_difference(comparison)
        end
      end

      private

      def self.calculate_difference(comparison)
        return 0 if comparison.any?(&:nil?)
        comparison.first == comparison.last ? 0 : 1
      end

    end

It's more lines of code in total, but I'll sometimes prefer two short methods over one longer one if splitting up unrelated logic. In this case, I use `Array#zip` to turn the two strings of letters into an array of pairs at each index, so I can compare them. Then, I used Ruby's `Array#inject` method to return the number of differences between the pairs. I was happy to move calculating that difference into a separate method which checks that both strings in the pair actually have a letter, and returns the number of differences (either 0 or 1 since it's a single comparison).

I still have some reservations about this approach, but I felt good enough about it to `exercism submit` it. [Here it is](http://exercism.io/submissions/7c979c9e239ffa1b84b3f2ca) if you have any suggestions!

## Nitpicking Others

Doing exercises is only half of Exercism.io. The other half, which I found equally rewarding, is giving feedback (or "picking nits," as they call it). It's easy to find hundreds of other people working on the same exercise you are, and it's instructive both to see how they've solved it, and to compare their approaches to yours. I happened upon [an approach by Github user jesk](http://exercism.io/submissions/f8e9de857a028622866daa11) which is longer and more procedural---two things I typically try to avoid---but which I found to be quite clear about what it's doing. Still, I was able to provide some suggestions for simplifying jesk's approach, and learned some things in the process:

* Ruby has `String#empty?` but no `String#full?` (which wouldn't make sense anyway). For its opposite, as an alternative to `!str.empty?`, you can do `str[0]` which returns nil and evaluates to false when part of a conditional.
* `Array#min` typically returns the smallest value in an array, but when <s>all elements of an array are strings, it implicitly returns the shortest one.</s> **Update::** This is incorrect. `Array#min` with strings actually returns the string nearest the beginning of the alphabet. It was random chance that all of the exercise's tests still passed on this assumption. To actually fetch the shortest string in an array, use `Array#min_by(&:length)`.

## Addendum: Automatucally Running Exercism.io Tests

Perhaps to keep things simple, Exercism.io doesn't come with any way to automatically run the tests while you're writing code. I find that essential to getting into a rhythm with TDD, and fortunately it was easy enough to set up with [guard-minitest](https://github.com/guard/guard-minitest). First, I created a Gemfile and added it to my Exercism.io "ruby" folder:

    # Gemfile
    source 'http://rubygems.org'
    
    gem 'guard-minitest'

After a `bundle install` I generated the default Guardfile with

    $ bundle exec guard init minitest

But the following was all I needed to automatically run the Exercism.io tests whenever I changed a test file or, more often, the class file under test:

    # Guardfile
    guard :minitest, autorun: false, test_folders: '*' do
      watch(%r{^(.*)\/(.*)_test\.rb$})
      watch(%r{^(.*)\/(.*)\.rb$}) { |m| "#{m[1]}/#{m[2]}_test.rb" }
    end

I set `autorun: false` because Exercism.io's test files include it already. And I had to specify `test_folders: '*'` because Exercism's test files don't reside in any particular directory. For the first exercise it was "hamming," but that will change so I used a wildcard.
