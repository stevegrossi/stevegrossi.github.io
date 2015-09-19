---
title: Dynamic Error Pages With Rails 3.2
date: 2013-04-06 23:56 UTC
tags:
  - rails
  - errors
---

I've long struggled with how best to implement dynamic error pages in Rails. The default solution, simply rendering static HTML files from the public root, is appropriately simple for 500 errors where your app may not be capable of rendering a dynamic page, but falls short for less grave errors, especially the common 404. I'll often want to render a 404 using my application's layout so as not to confuse users, include partials such as for a search form, and I recently worked on an internationalized app where I wanted to translate the 404 message. Rails will serve localized static pages (e.g. 404.en.html, 404.de.html), but I'd rather keep everything in my locale YAML files and render it with `I18n.t('not_found')`.

<!--more-->

## The Old Ways

In the past, I've handled this two ways. The simplest was to have a catch-all route at the bottom of routes.rb like

    match '*a', to: 'static_pages#error_404'

so that any request not caught by earlier routes would be directed to an error_404 action which would render the template in static_pages/error_404.html.erb. This worked fine until I needed a catch-all route for something else (dynamic, database-backed pages and redirects), and alas, like the Highlander, there can only be one. So I then changed my strategy to catching 404-like errors in application_controller.rb:

    unless Rails.application.config.consider_all_requests_local
      rescue_from ActionController::RoutingError, with: :render_404
      rescue_from ActionController::UnknownAction, with: :render_404
      rescue_from ActiveRecord::RecordNotFound, with: :render_404
    end

    def render_404
      render template: "static_pages/error_404", layout: 'application', status: 404
    end

But this always felt brittle, such as when ActionController::UnknownAction became AbstractController::ActionNotFound, or when ActionController::RoutingError was moved into to Rack middleware and ApplicationController could [no longer catch it][1]. Rails knows how to catch its own errors (to render those static pages), and I don't like having to assume that responsibility. Thankfully, as of Rails 3.2, I no longer have to.

## The New Way

Rails core member Jose Valim has a handy post on [his five favorite "hidden" features in Rails 3.2][2]. Number three is flexible exception handling which lets you set a configuration option to send exceptions through your routes.rb so you can route them wherever you want. That line is

    config.exceptions_app = self.routes

Now, in my routes.rb I have

    match '/404' => 'errors#error_404'
    match '/422' => 'errors#error_422'
    match '/500' => 'errors#error_500'

Which routes to my app/controllers/errors_controller.rb:

    class ErrorsController < ApplicationController
      def error_404
        respond_to do |format|
          format.html { render status: 404 }
          format.any  { render text: "404 Not Found", status: 404 }
        end
      end

      def error_422
        respond_to do |format|
          format.html { render status: 422 }
          format.any  { render text: "422 Unprocessable Entity", status: 422 }
        end
      end

      def error_500
        render file: "#{Rails.root}/public/500.html", layout: false, status: 500
      end
    end

I still render a layout-less static file for 500 errors because if things are going that wrong, my app may not be prepared to generate a layout or template. But for lesser errors I can render a full dynamic page for HTML requests and a simple text output for all others. (Without the format detection, I was seeing MissingTemplate exceptions for non-HTML, e.g. JSON or JPG, requests to unknown routes.) Plus, it's flexible enough to make it relatively easy to handle additional error codes--one day I'll get around to handling [status code 418, "I'm a teapot"][3].

[1]: https://github.com/rails/rails/issues/671
[2]: http://blog.plataformatec.com.br/2012/01/my-five-favorite-hidden-features-in-rails-3-2/
[3]: http://error418.net/
