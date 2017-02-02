class InnerHTML {

    getDriftInnerHtml(showDrift, DRIFT_SNIPPET_VERSION, DRIFT_KEY) {
        const driftVersion = "drift.SNIPPET_VERSION = '" + DRIFT_SNIPPET_VERSION + "';";
        const driftLoad = "drift.load('" + DRIFT_KEY + "')";

        let driftInnerHtml = "";
        if (process.env.NODE_ENV === "production" && !!showDrift) {
            driftInnerHtml =
              '!function() {' +
              '  let t;' +
              '  if (t = window.driftt = window.drift = window.driftt || [], !t.init) return t.invoked ? void (window.console && console.error && console.error("Drift snippet included twice.")) : (t.invoked = !0, ' +
              '  t.methods = [ "identify", "track", "reset", "debug", "show", "ping", "page", "hide", "off", "on" ], ' +
              '  t.factory = function(e) {' +
              '    return function() {' +
              '      let n;' +
              '      return n = Array.prototype.slice.call(arguments), n.unshift(e), t.push(n), t;' +
              '    };' +
              '  }, t.methods.forEach(function(e) {' +
              '    t[e] = t.factory(e);' +
              '  }), t.load = function(t) {' +
              '    let e, n, o, r;' +
              '    e = 3e5, r = Math.ceil(new Date() / e) * e, o = document.createElement("script"), ' +
              '    o.type = "text/javascript", o.async = !0, o.crossorigin = "anonymous", o.src = "https://js.driftt.com/include/" + r + "/" + t + ".js", ' +
              '    n = document.getElementsByTagName("script")[0], n.parentNode.insertBefore(o, n);' +
              '  });' +
              "}();" + driftVersion + driftLoad;
        }
        return driftInnerHtml;
    }

    getGoogleAnalytics(REPLACE_WITH_YOUR_CLIENT_ID) {
        const js = "gapi.analytics.ready(function() {                " +
          "" +
          //"  /**" +
          //"   * Authorize the user immediately if the user has already granted access." +
          //"   * If no access has been created, render an authorize button inside the" +
          //"   * element with the ID 'embed-api-auth-container'." +
          //"   */" +
          "  gapi.analytics.auth.authorize({" +
          "    container: 'embed-api-auth-container'," +
          "    clientid: '" + REPLACE_WITH_YOUR_CLIENT_ID + "'" +
          "  });" +
          "  " +
          "" +
          //"  /**" +
          //"   * Create a new ViewSelector instance to be rendered inside of an" +
          //"   * element with the id 'view-selector-container'." +
          //"   */" +
          "  let viewSelector = new gapi.analytics.ViewSelector({" +
          "    container: 'view-selector-container'" +
          "  });" +
          "" +
          //"  // Render the view selector to the page." +
          "  viewSelector.execute();" +
          "" +
          "" +
          //"  /**" +
          //"   * Create a new DataChart instance with the given query parameters" +
          //"   * and Google chart options. It will be rendered inside an element" +
          //"   * with the id 'chart-container'." +
          //"   */" +
          "  let dataChart = new gapi.analytics.googleCharts.DataChart({" +
          "  query: {" +
          "    metrics: 'ga:sessions'," +
          "    dimensions: 'ga:date'," +
          "    'start-date': '30daysAgo'," +
          "    'end-date': 'yesterday'" +
          "  }," +
          "  chart: {" +
          "    container: 'chart-container'," +
          "    type: 'LINE'," +
          "    options: {" +
          "    width: '100%'" +
          "    }" +
          "  }" +
          "  });" +
          "" +
          "" +
          //"  /**" +
          //"   * Render the dataChart on the page whenever a new view is selected." +
          //"   */" +
          "  viewSelector.on('change', function(ids) {" +
          "    dataChart.set({query: {ids: ids}}).execute();" +
          "  });" +
          "" +
          "});";

        return "let readyGoogleAnalytics= function(){" + js + "};" + this.getDocumentReady();
    }

    getDocumentReady() {
        return 'if (' +
          '  document.readyState === "complete" ||' +
          '  (document.readyState !== "loading" && !document.documentElement.doScroll)' +
          ') {' +
          '    readyGoogleAnalytics();' +
          '} else {' +
          '    document.addEventListener("DOMContentLoaded", readyGoogleAnalytics);' +
          '}';
    }

}

export default InnerHTML;
