---
title: Tips for Building Static Sites with Middleman
date: 2014-05-06 16:53 EDT
tags:
  - static sites
  - performance
---

After a year of powering this site on a WordPress self-install, I recently switched to deploying this site as static HTML, published and kept organized by [Middleman](http://middlemanapp.com) and served up by Github pages. (*Update:* I’ve since switched to Jekyll for tighter integration with Github pages.) I’ve been quite pleased with the experience and results. Here's why I switched, and some things I learned in doing so.

<!--more-->

## Why Static Sites?

The past few years has brought a renewed interest in deploying static sites, meaning websites whose pages exist on the server as plain HTML files. I remember static sites from the earliest days of my career, and not fondly: back then it meant that when you needed to update something in the header or footer, you had to manually update every single HTML file in the project. Thankfully, that's not what I'm talking about here. The biggest difference between those static sites and today's are the tools used to create them—I’ve used **Jekyll** and **Middleman**—which let you develop in a fully dynamic environment with all of its advantages: includes, an asset pipeline, and even a blogging engine. It's only when you deploy your site that it's compiled down to static HTML, with all of its inherent advantages:

- **Host It Anywhere:** if you have a web server, you can host static HTML files. No worrying about database drivers or version compatability. And for that reason, there are many excellent, inexpensive static hosting options which open up like Amazon S3 or Github Pages.
- **Performance Potential:** There are few things web servers can do faster than serve up static HTML files. That's not to say static sites are automatically faster, but most of the common performance pitfalls like numerous database queries or extensive server-side processing simply don't apply.
- **Version Control of Content:** by keeping your static site in a Git repository, you get backup and versioning for free, whereas that's a good bit of work to configure in a database-backed system. And if you make it available on Github, pull requests make for easy collaboration.
- **Security:** With no database and nothing running on the server, static sites are immune to most (though certainly not all) web security vulnerabilities.

### Why Not?

Of course, static sites aren't for every project. Static site generators require some programming knowledge—at least how to install and run things from the command line—so you probably won't be building a website for a mom n' pop store this way.

Search is also a challenge for static sites, because that often relies on server-side scripting. Common solutions include generating an index as part of the build process and accessing it with a javascript-based search plugin, or externally indexing your site with with something like [Google Site Search](https://www.google.com/work/search/products/gss.html) or [Swiftype](https://swiftype.com/).

## Blogging with Middleman

### Drafts

Middleman lets you add `published: false` to an article's frontmatter to hide it from `middleman build`, but there are two reasons why that wasn't sufficient for my drafting needs. First, unpublished posts still appear in development. (Initially I thought `published: false` was broken.) I can understand why you might want to preview unpublished posts in development, but for me, drafts are often just a link and some bullet points, which I don't need to see at the top of my blog in development. And second, given my permalink structure, drafts need a date to be created, which means once I get around to developing and publishing the draft, I have to change both the filename and the `date:` attribute in the post's frontmatter.

Both of these problems are solved by Fabio Rehm's addon, [middleman-blog-drafts](https://github.com/fgrehm/middleman-blog-drafts). Simply by adding `activate :drafts` in your middleman config.rb, you gain the command `$ middleman draft` which creates an undated draft within the new source/drafts dircetory for brainstorming a future post, and `$middleman publish` which moves a draft post into source/posts and gives it the current date when you're finally ready to publish.

### Deploying

The [middleman-deploy](https://github.com/karlfreeman/middleman-deploy) gem is hands-down the easiest way to publish a middleman site on a number of platforms. I was amazed at how easy it was to get this blog up-and-running on Github Pages.

## Development

### Testing Your Site Locally

Before deploying a middleman site, you'll want to run `$ middleman build` to generate the final production-ready version. And you'll also want to test it out: things like the asset pipeline and unpublished posts work differently during the build process than when previewing via `$ middleman server`.

You can always drag the generated build/index.html file into a browser, but I found it more convenient to get Apache running on my laptop and access the site via a custom domain. Just point your custom domain to localhost:

    # /etc/hosts
    127.0.0.1 middleman.dev

And create a virtual host pointing to your middleman site's build directory:

    # /private/etc/apache2/extra/httpd-vhosts.conf
    <VirtualHost *:80>
      DocumentRoot "/Users/steve/Sites/my-middleman-site/build"
      ServerName middleman.dev
    </VirtualHost>

Then restart apache and access your site as if it were published. The first time you do, this would be a great time to look into...

### Performance Optimization

I ran Chrome DevTools' performance audit on a standard middleman installation and discovered a few opportunities for improved front-end performance:

First, make sure your text assets are minified:

```ruby
# config.rb
activate :minify_html
activate :minify_css
activate :minify_javascript
```

And make sure you're GZIPping text assets:

```ruby
activate :gzip
```

Additionally, if your site makes heavy use of image assets, be sure to compress them as part of the build process. Middleman recommends:

```ruby
# First: gem install middleman-smusher
require "middleman-smusher"
activate :smusher
```

However, this will only work for PNG images. I like the [middleman-imageoptim](https://github.com/plasticine/middleman-imageoptim) plugin for great compression of many common image formats.
