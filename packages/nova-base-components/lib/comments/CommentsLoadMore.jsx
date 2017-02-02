import React from 'react';

const CommentsLoadMore = ({loadMore, count, totalCount}) => {
    const label = totalCount ? `Load More (${count}/${totalCount})` : "Load More";
    return (
      <button
        onClick={loadMore}
        className="button_2I1re mediumSize_10tzU secondaryBoldText_1PBCf secondaryText_PM80d orangeSolidColor_B-2gO solidVariant_2wWrf showAllButton_3sKYG">
          <div className="buttonContainer_wTYxi">Show all comments</div>
      </button>
    )
};

CommentsLoadMore.displayName = "CommentsLoadMore";

module.exports = CommentsLoadMore;