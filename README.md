# tech test
** tech test bare bones
**
**Steps to run the test
**

Make sure you have yarn and node.js

Run yarn at root

**To run the test simple run
**

yarn cypress run

**If you want to see whats going on please run
**

yarn cypress open

You can see the test failures on cypress -> fixture -> video. Please fix before proceeding with the application.


**For the array check
**

I have done two checks one that will return if the array from its point goes down and then should go up --- this will return null.
This is so that if there is a long array it will break the for loop, rather than go to the end

The other check is to see if the left hand side is the same as the right hand side --- this will return the position

If for some reason it goes right to the end of the array and the left hand side and right hand side equal the same it will return null

**How I can improve the search
**
I started half way, but what I should do is to continue going to the half way points of the array, that will actually be a faster search. 