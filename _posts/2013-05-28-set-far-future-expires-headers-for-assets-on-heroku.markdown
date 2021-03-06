---
title: Set Far-Future Expires Headers for Assets on Heroku
date: 2013-05-28 00:00 EDT
tags:
  - heroku
  - performance
  - rails
---

I love Heroku for deploying Rails apps. If you use Heroku too, you may have noticed a line of output when deploying:

<!--more-->

    -----> Rails plugin injection
           Injecting rails3_serve_static_assets

Heroku forces your app server process (e.g. Thin or Unicorn) to serve your compiled assets. With another server setup, you might prefer to have your web server (Nginx or Apache) do that for you because it's much better at it, but this isn't an option with a pure Heroku deployment.

Now, the whole point of the asset pipeline and fingerprinting your assets (i.e. giving them filenames like application-c06d2c86735917768406c3268ebf3e23.css) is so that the browser can cache them forever because if they do change, the filename will change as well and browsers will not use the cached version. But Rails doesn’t serve static assets by default, and thus isn’t set up to tell browsers to cache these assets. This is a big performance loss because it both slows down your server serving up these assets on each request, and slows down the user’s browser waiting for them to be delivered on each request. Thankfully, it’s an easy fix to tell Rails to set far-future expires headers on assets it serves up. In your environment config file, add this line for Rails 4 applications:

```ruby
# e.g. config/environments/production.rb
config.static_cache_control = "public, max-age=31536000"
```

And in Rails 5, this setting was renamed in order to accommodate multiple headers:

```ruby
# e.g. config/environments/production.rb
config.public_file_server.headers = {
  "Cache-Control" => "public, s-maxage=31536000, maxage=15552000",
  "Expires" => "#{1.year.from_now.to_formatted_s(:rfc822)}"
}
```

See [this post](http://blog.bigbinary.com/2015/10/31/rails-5-allows-setting-custom-http-headers-for-assets.html) for an explanation of this improvement.
