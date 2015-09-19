---
title: Best Practices for Paperclip Performance
date: 2013-05-30 00:00 EDT
tags:
  - paperclip
  - performance
  - rails
  - s3
---

[Paperclip][1] is a great gem for handling file uploads in your Rails app, but there are some important steps you need to take to ensure the best performance when serving images.

<!--more-->

## Set Expires Headers

I'm using Amazon S3 to serve images, and Paperclip doesn't tell S3 to set expires headers on uploads by default, which means browsers won't cache these uploads, leading to a massive performance loss (not to mention S3 transfer expense). Make sure to set these yourself with the option:

    :s3_headers => {'Expires' => 1.hour.from_now.httpdate}

Or better yet, set far-future expires headers and \[http://mike.bailey.net.au/2010/06/asset-fingerprinting-with-paperclip/ generate fingerprint filenames\] (> 2.3.4) for your assets to expire them (like Rails' asset pipeline does). Add an `attachment_fingerprint` column to your model and use :fingerprint in the path:

    :path => "users/:id/:attachment/:fingerprint-:style.:extension",
    :s3_headers => {'Expires' => 1.year.from_now.httpdate}

## Compress JPEGs

You should convert image uploads to JPEG and compress them at least a bit:

    :convert_options => { :medium => "-quality 80" }

If you expect uploads of animated GIFs, it seems you can [http://stackoverflow.com/questions/8994006/how-to-make-conditional-styles-in-paperclip conditionally apply compression styles] so animated GIFs aren't converted.

## Use Progressive JPEGs

Progressive JPEGs tend to [http://www.yuiblog.com/blog/2008/12/05/imageopt-4/ compress better]. Here's how to [http://www.codebeerstartups.com/2012/10/save-image-as-progressive-image-using-paperclip-and-imagemagick/ have Paperclip save progressive JPEGs]:

    :convert_options => { :medium => "-quality 80 -interlace Plane" }

 [1]: https://github.com/thoughtbot/paperclip
