# IMDb Picker

A Google extension that can be used to pick content from your watchlist.

## FYI

The extension only works with IMDb Watchlist because normal user lists have pagination. I already spent so much time with the watchlist so I didn't want to deal with that.

## How can you use it?

When you are on your watchlist extension can be used to load all content from the list. After that, you can randomly select an element (Movie / TV Series / Documentary etc.). There is a slider for filtering the ratings. If you set the slider "0" which is the default value, the extension can pick the unreleased contents as well.

## How does it work?

Basically, when you click the "Load Content" button, the extension tries to find a "Load More" button on the page. It clicks it to load the whole list. To get the data the extension scrolls to the anchors of the page (every 50th content) to trigger the lazy loading. After that, If you click the "Random Picker" button the extension scrolls to the random content for a final time to load the cover image properly because even if you trigger lazy loading you need to have a delay to load the cover image. Without an API this is the only logical way that I can think of to load all data and images. With scrolling... IMDb team has a weird design on their website.

### Trademark

IMDb, IMDbPro, STARmeter and all related logos are trademarks of IMDb.com, Inc. or its affiliates.
