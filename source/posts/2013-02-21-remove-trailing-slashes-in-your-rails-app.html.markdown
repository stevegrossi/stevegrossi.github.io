---
title: Remove Trailing Slashes in Your Rails App
date: 2013-02-21 23:53 UTC
tags: rack, rails, seo
---

Aside from being inelegant, having your pages accessible both with and without a trailing slash is [an SEO no-no][1] because search engines can treat them as separate pages, diluting your page rank. For this reason, it's best to choose one and redirect the other to it.

I prefer no trailing slashes for many reasons. First, who wants unnecessary characters? Also, trailing slashes are historically used for directories in a filesystem and left off for individual files. Because every page on the internet is a file (most often an HTML file), semantically trailing slashes don't belong. Finally, Rails in particular makes it easy to let pages respond to different formats by appending ".json" or ".xml" to the URL, and "/books/.json" looks dumb.

There are plenty of ways to redirect trailing-slash URLs to their slashless counterparts at the server level (via Apache or Nginx), but for someone like me on Heroku with limited access to the server configuration, the **rack-rewrite** middleware provides a simple solution:

    # Gemfile
    gem 'rack-rewrite'

    # config/application.rb
    config.middleware.insert_before(Rack::Lock, Rack::Rewrite) do
      r301 %r{^/(.*)/$}, '/$1'
    end

Thanks to [Nance's Kitchen][2] for this one.

[1]: http://www.seomoz.org/learn-seo/duplicate-content
[2]: http://nanceskitchen.com/2010/05/19/seo-heroku-ruby-on-rails-and-removing-those-darn-trailing-slashes/
