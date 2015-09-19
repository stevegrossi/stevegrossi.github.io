---
title: 'This Week I Learned #3'
date: 2014-01-18 00:00 EST
tags:
  - rails
  - seo
---

A robots.txt gotcha, cleaning up asset output in Rails' logs, reversing a specific git commit (in a way that's itself reversible), displaying errors with ActiveAdmin, and—spoiler alert—the keyboard shortcut for "View Source" in Chrome on a Mac is <kbd>Cmd</kbd> + <kbd>Opt</kbd> + <kbd>u</kbd>

<!--more-->

## robots.txt can block Google from recognizing 301 redirects

I built a site for a client that was at a new URL, so I asked their previous webmaster to set up 301 redirects from the old domain to the new one. After launch, everything seemed in order, but before long someone noticed that the old site was still appearing in search results, only with a message from Google that "A description for this result is not available because of this site's robots.txt". What seems to have happened is that the previous webmaster, in addition to setting up 301 redirects, also added a robots.txt file with

    User-agent: *
    Disallow: /

which forbids search engines from indexing the old site. Google couldn't index the site, and so it didn't know that the site had been moved permanently (as a 301 redirect would indicate), and thus the site remained in its search results.

## Clean up Rails logs in development with quiet_assets

Finally fed up with trying to visually parse Rails logs littered with lines like

    Started GET "/assets/application.js?body=1" for 127.0.0.1 at 2012-02-13 13:24:04 +0400
    Served asset /application.js - 304 Not Modified (8ms)

I found [quiet_assets][1], a fabulous little gem that does one thing and does it well: suppress asset logs like the above. Install it with

    # Gemfile
    gem 'quiet_assets', :group => :development

and restart your server.

## Reverse a git commit with `git revert`

If you ever need to undo the changes made by a previous git commit, `git revert [SHA]` is your friend. It simply applies the diff of any commit you choose but in reverse.

## Display non-attribute (base) errors in Active Admin

[Active Admin][2] is a superbly handy gem for quickly creating admin interfaces for a Rails site. It handles all sorts of things out-of-the-box, including highlighting invalid form fields when there's an error. But sometimes you need to validate something that pertains to your model as a whole, not necessarily a single field. Perhaps something like this:

    # app/models/post.rb
    validate :translated_into_english

    def translated_into_english
      if translations.none?(&:in_english?)
        errors.add(:base, "Requires a translation into English")
      end
    end

By default, Active Admin may not show this error, but one line in your form block will do the trick:

    form do |f|
      f.semantic_errors
      # ... fields
    end

Now, any errors on `:base` will appear in a flash message at the top of the edit page.

## Keyboard Shortcut to View Source in Chrome: Cmd + Opt + U

This was one of those things I do so often that I finally decided to commit the keyboard shortcut to memory. Thoughtbot's Ben Orenstein had [a great chat with the Ruby Rogues][3] on this sort of thing, which he calls "tool sharpening". I've found a lot of payoff in his idea that you should spend a little bit of time each day not just working but improving *how* you work.

 [1]: https://github.com/evrone/quiet_assets
 [2]: http://www.activeadmin.info/
 [3]: http://rubyrogues.com/129-rr-sharpening-tools-with-ben-orenstein/
