---
title: How to Evaluate Code
date: 2015-08-22 07:00 EDT
tags:
---

https://css-tricks.com/what-a-css-code-review-might-look-like/

http://blog.codinghorror.com/the-best-code-is-no-code-at-all/
"The Best Code is No Code At All"

http://devblog.avdi.org/2011/01/07/fast-and-good/

http://blog.drewolson.org/good-software-developers/

http://decidedlycursory.com/post/30869180028/scale-of-awesomeness

  - plus Can anyone else understand it? Everyone else? Will it work next year? In 5 years?

- Does it work? Does it meet the technical requirements.
  - starting out, this seems like enough. It works! It feels great. But it's not the end.
- What are its potential effects on the rest of the code now and in the future? Maybe you needed to add a minimum length requirement on users' passwords—did you think about the effect on existing users whose passwords don't meet that requirement?
- It is clear? Code is for people. When another developer (including your future self 6 months down the line) looks at your code, how obvious is what you were trying to do and how you did it?
- Is it consistent?
  - consistent with the project (styleguide, etc.)
  - idiomatic (consistent with other projects using the same language), e.g. `each` instead of `for`
- Is it performant? (maybe higher up?)
  - we're not talking micro-second optimizations here. Just that it does its job in about the same amount of time or less than the previous code.
  - tools for this?
- Is it secure?
  - this definitely goes higher up
  - 
