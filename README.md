# IMDb Picker

A Google extension that can be used to pick content from your lists.

[![Chrome Web Store Logo](https://github-production-user-asset-6210df.s3.amazonaws.com/41836294/278406124-dd949506-47e1-4a7c-ba4a-31920e5f2c72.png)](https://chrome.google.com/webstore/detail/imdb-picker/fgphemfgilhlepdebnnejndnldgemfbg)

![Screenshot_1](https://github.com/bariskiral/imdb-picker/assets/41836294/134b07f7-a05b-4497-a02e-3dd16d3759fd)
![Screenshot_2](https://github.com/bariskiral/imdb-picker/assets/41836294/ad1aaba4-9058-4486-abc4-a37f1e229eb4)

## How do you use it?

When you are on any IMDB list, the extension can be used to load all content from the list. Afterwards, you can randomly select a title (Movie / TV Series / Documentary etc.). There is a slider for filtering the ratings. If you set the slider "All" which is the default value, the extension can also pick the unreleased contents. If you want additional filters like maximum rating, genres, release dates etc. you can use the filter on the IMDb list. After that, the extension can still select a random title from the filtered list.

## How does it work?

- When you click the "Load All" button, the extension tries to find a "Load More" button on the page. It clicks it to load the whole list.
- To get the data, the extension scrolls to the bottom of the page to trigger the lazy loading.
- After that, If you click the "Random Pick" button, you will get a random title from the list.
- Without an API this is the only logical way that I can think of to load all data and images. With scrolling... At least the new IMDb website is better than the older version.

## FAQ

### Is it getting my data?

No. All the data is stored locally.

### Do I need to make my list public?

No.

### If I leave the page the random pick will reset?

The only way to reset the extension is by closing the IMDb tab, reloading it or opening another IMDb watchlist. Apart from these, the extension will keep all the values and data.

### Is it not working with the normal lists?

YES! Previously it was working with only watchlists. Because IMBd had a totally different structure in their lists. But with the March 2024 update, they changed all the lists to the same design.

### How long does it take to load all data?

Depends on your delay value but roughly (delay value \* item count / 25) seconds. For example, if you have 200 movies/TV series etc. in your watchlist it will take about 8 seconds.

### Why is it slow?

Because IMDb does not show all the titles on the lists unless you load and scroll to them. If you choose a longer delay, it will take a lot more time. This is not using any API. If I had access to IMDb API this whole project would be 50 lines of code and every action takes not even 1 second.

### Why is it fast?

If you are asking this question you probably did use other similar extensions. In this extension, I did not use the data until I really needed it. I did not scroll to every single element. I did not store or send the whole data. Only after you click "Random Pick" I get the data on the page. This speeds up the extension.

### Why did you try so hard? Is selecting a random movie this hard?

Well, no. But I like coding and wasting my time.

## Trademark

IMDb, IMDbPro, STARmeter and all related logos are trademarks of IMDb.com, Inc. or its affiliates.
