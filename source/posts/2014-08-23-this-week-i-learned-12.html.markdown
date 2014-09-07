---
title: 'This Week I Learned #12'
date: 2014-08-23 07:47 EDT
tags: rails, css, sass
---

This week, I learned how to clean up complex or repeated validations with ActiveModel's custom validator objects; how to write cleaner, more intention-revealing Sass with pure functions; and a useful but little-known CSS selector with a lot of potential.

READMORE

## Use Custom Validators in Rails

From Bozhidar Batsov's excellent [Rails style guide](https://github.com/bbatsov/rails-style-guide), I discovered how easy is to extend ActiveModel validations with your own custom validators. For things like emails, URLs, or often-repeated rules specific to your app's domain, this can help DRY out repeated code. Just create a class that inherits from `ActiveModel::EachValidator` and defines a `validate_each` method with the right arguments:

    # app/validators/email_validator.rb
    class EmailValidator < ActiveModel::EachValidator
      def validate_each(record, attribute, value)
        unless value =~ /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i
          record.errors[attribute] << (options[:message] || 'is not a valid email') 
        end
      end
    end

Rails will autoload any custom validators in app/validators and let you use them like so:

    class Person
      validates :email_address, email: true
    end

And because these are Ruby objects, you can do the usual things to keep your classes tidy. For instance, in Batsov's example above, I would break `options[:message] || 'is not a valid email'` into a private `message` method and the regex into a `REGEX` constant.

## Use Sass Functions to Clean Up CSS

Similar to mixins, Sass (since 3.1) lets you write your own functions (like Sass' native `lighten()`, `nth()`, and such). I found this useful working on a project where the Photoshop designs had all of their measurements in pixels, but for simpler responsiveness I wanted to declare them in `em`. The project already had a `$base-font-size` variable declared, so my function looked like this:
    
    @function ems($px, $base: $base-font-size) {
      @return ($px / $base) * 1em
    }

Which allowed me to easily convert pixel values into ems:

    .headline {
      font-size: ems(72px);
      margin-bottom: ems(48px);
    }

A font-size of `4.5em` in the CSS might not be clear as to where it comes from, but with this function you get all the benefits of an `em` value like automatic size adjustment when the context changes, while being intention-revealing as to its origin. Another developer working from a newer version of the Photoshop file will know exactly what to change if the headline needs to be 80px now.

# Use the :only-child Pseudo Selector

While working on my personal website, I've been building a way to link to next and previous posts at the end of a single post. I wanted a split view: the left half a left-aligned block link to the previous post, and the right half a right-aligned block link to the next post. But when there you're viewing the most recent post and there *is* no next post, I wanted the "Previous Post" block to take up the entire width with its text centered.

I considered adding a conditional to my Rails template which adds a `no-next-post` class to change the design and alignment when appropriate, but I knew of `:first-child` and `:last-child` and on a whim tried out the `:only-child` pseudo-selector, and it's a thing! Now, I can expand and center the link when there's no alternative without further complicating the template:

     // previous post:
    .continue-reading:first-child { text-align: left; ... }

    // next post:
    .continue-reading:last-child { text-align: right; ... }

    // next/previous post when there's no other option
    .continue-reading:only-child { text-align: center; ... }
