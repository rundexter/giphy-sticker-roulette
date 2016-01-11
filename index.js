var assert = require('assert');
var _ = require('lodash');

module.exports = {
  run: function (step, dexter) {
    //access token
    var accessToken = dexter.environment('access_token');
    var giphy = require('giphy-api')(accessToken);

    //inputs
    var q = step.input('q').first();
    var limit = step.input('limit').first();
    var offset = step.input('offset').first();
    var rating = step.input('rating').first();
    var fmt = step.input('fmt').first();

    //validation
    assert(q, 'Search query term or phrase is required.');

    //post options
    var postOptions = {
      api: 'stickers',
      q: q,
      limit: limit,
      offset: offset,
      rating: rating,
      fmt: fmt
    };

    //execution
    giphy.search(postOptions, function (err, res) {
      var finalResponse = {
        data: {}
      };

      if (fmt === 'html') {
        finalResponse.data.html = res;
      } else {
        if (res.data.length > 0) {
          var randomlySelectedGifId = _.random(res.data.length - 1);
          res.data = [res.data[randomlySelectedGifId]];
        }
        finalResponse = res;
      }

      if (err) return this.fail(err);
      this.complete(finalResponse);
    }.bind(this));
  }
};
