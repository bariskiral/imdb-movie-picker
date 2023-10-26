# IMDb Picker

A Google extension that can be used to pick content from your watchlist.

[![Chrome Web Store Logo](https://github-production-user-asset-6210df.s3.amazonaws.com/41836294/278406124-dd949506-47e1-4a7c-ba4a-31920e5f2c72.png)](https://chrome.google.com/webstore/detail/imdb-picker/fgphemfgilhlepdebnnejndnldgemfbg)

![1](https://github.com/bariskiral/imdb-picker/assets/41836294/acc3b7fc-351f-4814-88b1-1b50100bcf82)
![2](https://github.com/bariskiral/imdb-picker/assets/41836294/ba08b981-592d-4f49-bdee-b64e245f5c6b)

## FYI

The extension only works with IMDb Watchlist because normal user lists have pagination. I already spent so much time with the watchlist so I didn't want to deal with that.

## How do you use it?

When you are on your watchlist extension can be used to load all content from the list. After that, you can randomly select an element (Movie / TV Series / Documentary etc.). There is a slider for filtering the ratings. If you set the slider "0" which is the default value, the extension can pick the unreleased contents as well.

## How does it work?

- Basically, when you click the "Load All" button, the extension tries to find a "Load More" button on the page. It clicks it to load the whole list.
- To get the data, the extension scrolls to the anchors of the page (every 50th content) to trigger the lazy loading.
- After that, If you click the "Random Pick" button, the extension scrolls to the random content for a final time to load the cover image properly because even if you trigger lazy loading you still need to have a delay to load the cover image.
- Without an API this is the only logical way that I can think of to load all data and images. With scrolling... IMDb team has a weird design on their website.

## FAQ

### Is it getting my personal data?

No. All the data is stored locally.

### Do I need to make my list public?

No.

### If I leave the page the random pick will reset?

The only way to reset the extension is by closing the IMDb tab, reloading it or opening another IMDb watchlist. Apart from these, the extension will keep all the values and data.

### Why is it not working with the normal lists?

Because IMBd has a totally different structure in their lists I have to re-do all the checks, store all the data for every element and change to the next page if there is another one. There is too much work for a little extension. Feel free to improve the extension.

### How long does it take to load all data?

Depends on your delay value but roughly (delay value \* item count / 50) seconds. For example, if you have 200 movies/TV series etc. in your watchlist it will take about 4 seconds.

### Why is it slow?

Because IMDb is so slow. We need to wait for every action to load on the page. If you have a slow internet connection, it will take a lot more time. This is not using any API. If I had access to IMDb API this whole project would be 50 lines of code and every action takes not even 1 second.

### Why is it fast?

If you are asking this question you probably did use other similar extensions. In this extension, I did not use the data until I really needed it. I did not scroll to every single element. I did not store or send the whole data. Only after you click "Random Pick" I get the data on the page. This speeds up the extension but everything has a cost. The extension needs to scroll to the element for the poster image. It may be disturbing to some.

### Why did you try so hard? Is selecting a random movie this hard?

Well, no. But I like coding and wasting my time.

## Trademark

IMDb, IMDbPro, STARmeter and all related logos are trademarks of IMDb.com, Inc. or its affiliates.
