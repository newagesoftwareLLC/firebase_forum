//config.js required
search.addWidgets([
    instantsearch.widgets.searchBox({
      container: '#searchbox',
      placeholder: 'Search for topics',
    }),
    instantsearch.widgets.hits({
      container: '#hits',
      templates: {
        item: `
          <div id="{{objectID}}">
            <a href="javascript:;" onclick="GetTopic('{{objectID}}')">{{title}} <span class="badge">{{category}}</span></a>
          </div>
        `,
      },
    })
]);
search.start();