---
title: 'This Week I Learned #1'
date: 2013-12-20 00:00 EST
tags:
  - paperclip
  - ruby
  - sass
---

This is the first post in what I hope will be a weekly feature on things I've learned which are neat enough to mention, but not big enough for their own post.

<!--more-->

## How to rename a Paperclip attachment when an interpolated attribute in the Filename changes

It seemed like a common-enough use case, but I couldn't find any documentation in Paperclip or elsewhere on the web about how to rename files when an interpolated attribute is changed, so I figured out a pretty good way and put it into [this gist][1].

## Sass 3.3's @at-root selector makes Modernizr classes easier to work with

When working with a moderately-nested selector in Sass, if you want to target that selector when a particular Modernizr class applies, you currently have re-nest everything, like so:

```scss
.menu {
  .item {
    top: 0;
  }
  // ...potentially a lot more code
}
.3d-transforms {
  .menu {
    .item {
      transform: rotate(1deg);
    }
  }
}
```

This bugs me not just for the repetition, but because I have to go looking in two potentially quite distant places to find out how a single element should be styled. Soon, I won't have to, thanks to a handy new tool in Sass 3.3: `@at-root`. `@at-root` jumps you out of the current level of nesting, but crucially, still gives you access to the current selector with `&`. This means that instead of the preceding code, you can just write this:

```scss
.menu {
  .item {
    top: 0;
    @at-root .3d-transforms & {
      transform: rotate(1deg);
    }
  }
}
```

which will generate the same CSS as the first example, but with all the style rules for menu items in one place! Sass 3.3 isn't yet out at the time of writing, but in the meantime you can easily require the beta version in your gemfile:

```ruby
gem 'sass-rails'
gem 'sass', '~> 3.3.0.beta'
```

## Ruby's Hash#fetch takes a block

Thanks to [Viget's review of Avdi Grimm's *Confident Ruby*][2], I learned that Hash#fetch takes a block, which you can use to provide a default value for whatever you're fetching.

```ruby
def act_on_thing(options = {})
  thing = options.fetch(:thing) { Thing.new }
  # do some stuff...
end
```

But even if you're not using a block, `fetch` is handy because if you expect an option to be present, `options.fetch(:value)` will raise an IndexError if it's not there, catching potential errors right at the source. Compare that with options[:value], which is just nil if it's not present, so you may not see an error until later on when unrelated code chokes on the nil value.

 [1]: https://gist.github.com/stevegrossi/8070232
 [2]: http://viget.com/extend/confident-ruby-a-review
