'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const VisibilityFilters = props => {
  return (
    <form className="form-inline mb-1">
      <div className="form-check mb-2 mr-sm-2 mb-sm-0">
        <label className="form-check-label">
          <input className="form-check-input" type="checkbox" onChange={props.onUpdateVisibilityFilter} value="fulfilled" checked={props.visibilityFilter === 'fulfilled'} /> Fulfilled
        </label>
      </div>
      <div className="form-check mb-2 mr-sm-2 mb-sm-0">
        <label className="form-check-label">
          <input className="form-check-input" type="checkbox" onChange={props.onUpdateVisibilityFilter} value="unfulfilled" checked={props.visibilityFilter === 'unfulfilled'} /> Unfulfilled
        </label>
      </div>
      <div className="form-check mb-2 mr-sm-2 mb-sm-0">
        <label className="form-check-label">
          <input className="form-check-input" type="checkbox" onChange={props.onUpdateVisibilityFilter} value="all" checked={props.visibilityFilter === 'all'} /> All
        </label>
      </div>
    </form>
  );
};
VisibilityFilters.propTypes = {
  visibilityFilter: PropTypes.string.isRequired,
  onUpdateVisibilityFilter: PropTypes.func.isRequired
};

const WishItem = props => {
  const wish = props.wish;

  return (
    <div className={
        'd-flex p-2 justify-content-between' +
        ' wish-item elevate-1' +
        (wish.fulfilled ? ' wish-item--fulfilled' : '') +
        (wish.highlighted ? ' wish-item--highlighted' : '')
      }
      onClick={props.onHighlight}>
      <div className="wish-item-content">
        <h6 className="wish-item-content__title">{wish.day}</h6>
        <p className="wish-item-content__text"><small>Timespan: {wish.timespan}</small></p>
      </div>
      <div className="wish-item-actions">
        <button type="button" className="btn btn-sm btn-danger" onClick={props.onRemove}>&times;</button>
      </div>
    </div>
  );
};
WishItem.propTypes = {
  wish: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
  onHighlight: PropTypes.func.isRequired
};

const WishesList = props => {
  const wishFilter = wish => {
    if (props.visibilityFilter === 'all') {
      return wish;
    } else if (props.visibilityFilter === 'fulfilled') {
      return wish.fulfilled === true;
    } else if (props.visibilityFilter === 'unfulfilled') {
      return !wish.fulfilled;
    }
  };

  const wishes = props.wishes.filter(wishFilter)
    .sort((wishA, wishB) => {
      const momentA = moment(wishA.day + ' ' + wishA.after, 'YYYY-MM-DD HH:mm');
      const momentB = moment(wishB.day + ' ' + wishB.after, 'YYYY-MM-DD HH:mm');
      return momentA.diff(momentB);
    })
    .map(wish => {
      const onWishRemove = () => {
        props.onRemove(wish._id);
      };
      const onWishHighlight = () => {
        props.onHighlight(wish);
      };

      return (
        <WishItem
          key={wish._id}
          wish={wish}
          onRemove={onWishRemove}
          onHighlight={onWishHighlight} />
      );
    });

  return props.isLoading
    ? (<p>Loading</p>)
    : (
      <div className="wishes-list">
        <VisibilityFilters
          visibilityFilter={props.visibilityFilter}
          onUpdateVisibilityFilter={props.onUpdateVisibilityFilter} />
        {wishes}
      </div>
    );
};
WishesList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  visibilityFilter: PropTypes.string.isRequired,
  onUpdateVisibilityFilter: PropTypes.func.isRequired,
  wishes: PropTypes.array.isRequired,
  onRemove: PropTypes.func.isRequired,
  onHighlight: PropTypes.func.isRequired
};

export default WishesList;
