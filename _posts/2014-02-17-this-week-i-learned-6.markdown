---
title: 'This Week I Learned #6'
date: 2014-02-17 00:00 EST
tags: backbone, jquery
---

Getting started with Backbone.js and Underscore.js, and a jQuery trick for filtering empty values from an array.

<!--more-->

## Backbone.js

This week I finally got a chance to use [Backbone.js][1]. Before now, I had only a vague understanding of what it is and why you'd use it. Even after reading Ryan Bates' [introduction to Backbone][2] (subscription required) and Thoughtbot's [Backbone.js on Rails][3]—both excellent resources—I had a practical understanding of how to use Backbone well before I really "got" it.

Backbone is a lot of things, but there are just three that I found myself using most.

### API-Backed Data Structures

With just a few lines:

    var Todo = Backbone.Model.extend({
      url: '/todos'
    });

    var TodoList = Backbone.Collection.extend({
      model: Todo
    });

you can now get an instance of the to-do list from the server (Backbone will send a GET request to '/todos.json') with

    var myList = new TodoList.fetch()

And you can create a new todo and add it to the list (Backbone will send a POST request to '/todos.json' with the task attribute as data) with

    var newTodo = new Todo({ task: 'Pick up milk' });
    myList.add(newTodo);

In this way and many others, Backbone makes it simple and easy to interact with an API through client-side data structures.

### Rendering

Of course, eventually you're going to need to display those data structures. That's where Backbone views come in:

    var TodoListView = Backbone.View.extend({

      // This view goes in the DOM element with an ID of 'todolist'
      el: '#todolist',

      // When we create this view...
      initialize: function () {

        // It gets its data from the TodoList collection
        // (which Backbone knows how to fetch from the previous section)
        this.collection = new TodoList();

        // It should render itself (see below)
        this.render();
      },

      // To render this list view, list out all of its collection's items
      render: function() {
        this.collection.each(this.addTodo);
      },

      addTodo: function (todo) {

        // To add a to-do to the list, create
        // a new TodoItemView (not included here)...
        var todoView = new TodoItemView({
          model: todo
        });

        // render it, and append its contents to this view's element
        this.$el.append(todoView.render().el);
      }
    });

You'll call `render()` a lot in Backbone, because like partials in Rails, views can be nested. As we can see above, rendering a TodoListView consists only of rendering its individual to-dos. This is handy because when adding or editing a to-do, you don't need to re-render the entire list, only add, change, or remove the individual to-do in question, improving responsiveness.

### Events

Events are the glue which hold everything together in Backbone, and most of them happen automatically. When an item is added to a collection with `collection.add(item)`, the collection fires an "add" event. So, in the TodoListView above, we might add

    initialize: function() {
      // ...
      this.listenTo(this.collection, 'add', this.addTodo);
    },

and now that view can `listenTo` its collection and when a new item is added, it can respond to the "add" event by appending the new item to the list.

The biggest advantage here is *decoupling*, or keeping code that handles separate things, well, separate. This makes your code more organized (since you know where to look to change something) and keeps disparate pieces of code from interfering with each other. Your models know where to get and how to parse their data, and your views know which models (and collections of models) to show and how to show them. Backbone's built-in events are what keeps these different pieces communicating, but you can also add your own events very easily. Say you want to show more information about a to-do when the user clicks on it. That's as simple as:

    var TodoItemView = Backbone.View.extend({

      events: [
        'click': 'showMoreInfo'
      ],

      showMoreInfo: function(e) {
        // show more info
      }

    });

## Underscore.js

One of Backbone's dependencies is [Underscore.js][4], which accurately styles itself "a utility-belt library for JavaScript". In addition to providing functions to Backbone collections, Underscore is packed full of tricks for regular Javascript programming. Consider the case of passing each item in an array into a function. Compare the vanilla javascript implementation:

    var i;
    for(i = 0; i < myArray.length; i++) {
      var arrayItem = myArray[i];
      doSomethingTo(arrayItem);
    }

with that of Underscore:

    _.each(myArray, doSomethingTo);

Underscore is lightweight, and while you do pay a minor performance penalty for Underscore's magic, [Joel Hooks argues well][5] that "The 'clean readable code' optimization pays huge dividends, even if it comes at the cost of (very) marginal performance hits." (And if maximum performance is paramount, he suggests checking out [Lo-dash][6], a more performant fork of Underscore.)

## How to Remove Empty Values from an Array with `$.grep()`

Searching for a way to remove empty values from an array turned me on to jQuery's `grep()` function, as well as a neat trick with it. `$.grep()` takes an array and a function and returns a sub-array of only the elements that return true for that function. For example:

    $.grep([1, 2, 3, 4, 5], function(n) {
      return n <= 3;
    });
    // => [1, 2, 3]

The trick for removing null values is to use the `Boolean()` function, which returns false for null, undefined, or blank values. (Be careful, though, as it also returns false for the number "0". In my case I was dealing with strings so this wasn't a concern.) The code I ended up using looked like this:

    $.grep([address_1, address_2, city, state, zip], Boolean).join(', ')


If "address_2" or the zip code is blank, they are removed from the array and `join(', ')` only comma-separates what the user has entered.

 [1]: http://backbonejs.org/
 [2]: http://railscasts.com/episodes/323-backbone-on-rails-part-1?view=asciicast
 [3]: https://learn.thoughtbot.com/products/1-backbone-js-on-rails
 [4]: http://underscorejs.org/
 [5]: http://joelhooks.com/blog/2014/02/06/stop-writing-for-loops-start-using-underscorejs/
 [6]: http://lodash.com/
