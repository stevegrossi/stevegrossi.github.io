---
title: 'This Week I Learned #7'
date: 2014-03-01 00:00 EST
tags: problem solving, rails
---

## When You're Stuck, Examine Your Assumptions

I continue to learn this one the hard way. This week, I spent a couple of hours trying to fix something based on a flawed assumption about what Chrome's DevTools network inspector was showing me. When inspecting an AJAX request, I thought that the "preview" tab was showing me the request params, not the response params (since "Response" is its own tab), which hid from me the fact that Rails' strong_parameters was filtering out a required parameter and making the update fail.

## has_many Has Many Features

I learned two new things about Rails' has_many relations. The first is that has_many can take a proc to specify dynamic conditions. Say you have a social network and for whatever reason you want to show a user everyone who has the same name as them. You can do this:

    class User < ActiveRecord::Base
      has_many :doppelgangers, ->(user) { where fname: user.fname, lname: user.lname }, class_name: 'User'
    end

You can also use a proc to eager-load an association universally. Say you have an Invoice model which `belongs_to` an Order, which `belongs_to` a Customer, and everywhere you list invoices you include information on the Customer record. To preemptively avoid N+1 query issues, you could have ActiveRecord eager-load the customer records when fetching an invoice's order.

    class Invoice < ActiveRecord::Base
      belongs_to :order, -> { includes :customer }
    end
