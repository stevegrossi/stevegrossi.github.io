---
title: "Writing Fast (and Idiomatic) Ruby"
date: 2014-10-25 07:49 EDT
tags: ruby, performance
---

Ruby hero Erik Michaels-Ober gave a superbly userful talk ([video](https://www.youtube.com/watch?v=fGFM_UrSp70), [slides](https://speakerdeck.com/sferik/writing-fast-ruby)) at this year's Barcelona Ruby Conference. In it, Michaels-Ober offers up a dozen-or-so cases where some casual Ruby code can be made both faster and cleaner by using built-in Ruby features.

READMORE

This sometimes means using one method instead of two: for example, instead of `some_array.map(&:method).flatten` Ruby offers `some_array.flat_map(&:method)`. And sometimes it means using one method in lieu of another, such as `string.tr('_', '-')` instead of `string.gsub('_', '-')`. As if to prempt concerns that this is old news, Michaels-Ober accompanies many of his slides with pull requests to major projects like Rails and Rubinius to fix where the slower, less clear alternatives are still being used.

Michaels-Ober begins with a discussion of his benchmarking methodology, recommending a gem called [benchmark-ips](https://github.com/evanphx/benchmark-ips) which extends Ruby's benchmark library to show iterations-per-second instead of seconds-per-itaration. This gives you a simple bigger-is-better result and keeps you from having to guess how many iterations you'll need for the result to be meaningful. Now that [benchmarking is a part of my toolkit](/2014/07/05/this-week-i-learned-11/), I can definitely see the usefulness of this gem.

I would definitely recommend you [watch the talk](https://www.youtube.com/watch?v=fGFM_UrSp70) (45 min), but if you'd like the tl;dw version (and for my own future reference), here are the key insights:

- Within a method that takes a block, `yield` is *5x faster* than `block.call`
- Using Symbol#to_proc (e.g. `&:method`) is *20% faster* than using a block
- `.flat_map` is *4x faster* than `.map.flatten`
- `.reverse_each` is *17% faster* than `.reverse.each`
- `.each_key` is *33% faster* than `.keys.each`
- `.sample` is *15x faster* than `.shuffle.first`
- Hash#merge! is *3x faster* than Hash#merge (as long as you don't need immutable state)
- Passing a block as the second argument to `.fetch` is *2x faster* than passing the block's result directly
- `.sub` is *50% faster* than `.gsub` if you know you'll be making only one replacement
- `.tr` is *5x faster* than `.gsub` if you don't need regular expressions
- sequential assignment (e.g. `a = 1; b = 2;`) is *40% faster* than parallel assignment (e.g. `a, b = 1, 2`)
- Exceptions are quite slow. If you don't know if an objects responds to a method, checking `.respond_to? :method` in an `if` block is *10x faster* than rescuing `NoMethodError`

Of course, as the speaker makes clear, the speed comparisons are sensitive to the particular use case so your mileage may vary, but in every case the faster option will still be faster and in most of these cases, more intuitive.
