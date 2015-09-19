---
title: 'This Week I Learned #5'
date: 2014-02-09 00:00 EST
tags:
  - errors
  - postgresql
  - rails
  - security
---

Regular expressions in PostgreSQL, a terser `where()` syntax for ActiveRecord associations, signed cookies in Rails, and some tips for writing great error messages.

<!--more-->

## PostgreSQL Supports Regular Expressions

I needed to query a PostgreSQL database for records which matched certain #hashtags or @mentions. A simple `where('content LIKE ?', "##hashtag")` wouldn't be specific enough, because I didn't want queries for #bacon returning things like #baconlovers. As so often is the case, PostgreSQL was there for me with [pattern matching][1]. My regexes are a little too specific, but the general idea is this:

    scope :hashtagged, ->(hashtag) { where("content ~* ?", "(?:^|\s)##{hashtag}(?:$|\s)") }
    scope :mentioning, ->(handle) { where("content ~* ?", "(?:^|\s)@#{handle}(?:$|\s)") }

The `~` is the regular expression operator (think of Ruby's `=~`), and the trailing `*` makes it case-insensitive. In PostgreSQL, regular expressions aren't wrapped in forward slashes, but otherwise they work like regular expressions in other languages.

## Since Rails 3.2, `where()` Works With Polymorphic Relations

I'm always on the lookout for opportunities to *do more* with *less code*, and this week I found a minor but handy opportunity to do so. While working on an app in which a user `has_many` "likeables" (a polymorphic relation) through a `likes` join table, I needed to get the "like" instance joining a user to a photo. I'd initially written

    @user.likes.find_by(likeable_id: photo.id, likeable_type: photo.class.name)

But since Rails 3.2, polymorphic relations are smart enough to tease this out for themselves, so one can simply write:

    @user.likes.find_by(likeable: photo)

## Rails Supports Signed Non-Session Cookies

I knew that when you push a value into the session cookie (e.g. `session[:user_id]`), Rails 3+ signs it so that a user cannot change the cookie's value, which is great for security. But what if you need a cookie to persist beyond the user's session? There's `cookies[:user_id]`, but with that, the user can read and write the cookie, potentially impersonating another user.

To solve this, Rails has a helper to sign cookies, which works like this:

    cookies.signed[:secret] = { :value => "foo", :domain => "example.com") }

Now, if someone inspects their `user_id` cookie, instead of "1234" they'll see something like "BAhpBw%3D%3D--022a37ad45ed475783c1fc5dbc440748bb89fbdb". Good luck teasing a user_id out of (or back into) that. Rails signs the cookie with your app's `secret_token`, just like session cookies.

## How to Write Great Error Messages

[Ruby Weekly(http://rubyweekly.com/) pointed me to an excellent post by Brad Bollenbach titled [How to Write Good Error Messages][2]. The title's a bit too modest, since Brad has some great ideas for going above and beyond to help someone (including your future self) debug errors in your code. Especially in the absence of a tool like New Relic, it's important to log as much information as possible.

* **Be Descriptive:** include basic information such as a timestamp, the part of the program where the error was raised (such as the name of a rake task), identifying information like an `id` for the thing that exploded, and of course the error's class and message, which you can get from the error itself when you `rescue => error` with `error.class` and `error.message`. It's a good idea to include the backtrace (`error.backtrace`) as well.
* **Describe the System Impact:** Most errors have negative effects, so let the person looking into the error know what those may be, something as simple as "This means the confirmation email for Order ##{order.id} was not sent" or "This means the missile bay is unlocked as of #{Time.zone.now}".
* **Offer Tips for Debugging**: this is always useful, and can save your team time a good bit of time. For example, you might include a pre-built URL to a log parser for the time in which the error occurred, in case the error was the result of issues with the system at large (e.g. "View system status: http://logparser.com/system?from=#{Time.now.to_i}").

We've all been in the unfortunate situation of having to debug an error in someone else's app—maybe that someone else isn't even with the company anymore—and having no idea what the error means or where to start. It isn't hard to take the time and provide a solid bit of context for the next person to find themselves in that situation with *your* app, if for no other reason than that person is likely to be yourself.

 [1]: http://www.postgresql.org/docs/9.0/static/functions-matching.html
 [2]: http://bugroll.com/how-to-write-good-error-messages.html
