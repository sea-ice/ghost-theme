/**
 * Main JS file for Casper behaviours
 */

/* globals jQuery, document */
(function ($, undefined) {
  var $document = $(document);

  $document.ready(function () {

    // 渲染首页统计数据
    var statisticList = $("#statistic-list");
    if (statisticList.length) {
      $.get(
        ghost.url.api('posts', {
          limit: "all"
        })
      ).done(function (data) {
        statisticList[0].querySelector(".total-posts").innerHTML = data.posts.length;
      });
      $.get(
        ghost.url.api('tags', {
          limit: "all"
        })
      ).done(function (data) {
        statisticList[0].querySelector(".total-tags").innerHTML = data.tags.length;
      });
      var start = new Date(2017, 2, 13),
        now = new Date();
      statisticList[0].querySelector(".site-runtime").innerHTML = parseInt((now - start) / (24 * 3600 * 1000));
    }

    // 渲染归档页面
    var archiveList = $("#archive-list-container");
    if (archiveList.length) {
      $.get(
        ghost.url.api('posts', {
          limit: "all",
          include: 'tags,author'
        })
      ).done(archiveSuccessCallback);

      function archiveSuccessCallback(data) {
        var postInfo = {};
        $.each(data.posts, function (i, post) {
          var postDate = new Date(post.published_at),
            year = postDate.getFullYear(),
            month = postDate.getMonth();
          if (!(year in postInfo)) postInfo[year] = {};
          if (!(month in postInfo[year])) postInfo[year][month] = [];
          postInfo[year][month].push(post);
          console.log(post);
        });
        var years = Object.keys(postInfo).map((v) => parseInt(v)).sort((v1, v2) => (v2 - v1)),
          html = '<ul class="archive-list">',
          months, year, month, posts, postTags, postTime, postDate,
          monthsInAYear = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        for (var i = 0, yearCount = years.length; i < yearCount; i++) {
          year = years[i];
          html += '<li class="post-date-item post-date-year"><h2>' + year + '</h2></li>';
          months = Object.keys(postInfo[year]).map(v => parseInt(v)).sort((v1, v2) => (v2 - v1));
          for (var j = 0, monthCount = months.length; j < monthCount; j++) {
            month = months[j];
            posts = postInfo[year][month];
            html += '<li class="post-date-item post-date-month"><h3>' + monthsInAYear[month] + ' ' + year + '</h3></li>';
            for (var k = 0, postCount = posts.length; k < postCount; k++) {
              postDate = new Date(posts[k].published_at).getDate();
              month = formatDay(parseInt(month) + 1);
              postTime = year + "-" + month + "-" + formatDay(postDate);
              postDate = year + "年" + month + "月" + formatDay(postDate) + "日";
              postTags = posts[k].tags.map(tag => "<a href='/tag/" + tag.slug + "'>" + tag.name + "</a>").join(", ");
              console.log(posts[k].author);
              html += '<li class="post-item">' +
                '<a href="' + posts[k].url + '">' + posts[k].title + '</a>' +
                '<footer class="post-meta">' +
                '<img class="author-thumb" src="' + posts[k].author.image + '" alt="' + posts[k].author.image + '" nopin="nopin" /> ' +
                '<a class="post-meta-author" href="/author/' + posts[k].author.slug + '">' + posts[k].author.name + '</a><i class="split-point"></i>' +
                '标签: &nbsp;' + postTags + '<i class="split-point"></i>' +
                '<time class="post-date" datetime="' + postTime + '">' + postDate + '</time>' +
                '</footer>' +
                '</li>';
            }
          }
        }
        html += "</ul>";
        archiveList[0].innerHTML = html;
      }

      function formatDay(day) {
        return day > 9 ? day : '0' + day;
      }
    }

  });
})(jQuery);
