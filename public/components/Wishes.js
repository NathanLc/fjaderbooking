'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import app from '../app';
import WishesList from '../components/WishesList';
import NewWish from '../components/NewWish';
import WishDetails from '../components/WishDetails';

const NewWishButton = props => {
  return (
    <button type="button" className="btn btn-primary elevate-1" onClick={props.onClickNewWish}>New</button>
  );
};
NewWishButton.propTypes = {
  onClickNewWish: PropTypes.func.isRequired
};

const PanelWish = props => {
  const target = props.focus.on;
  const panelStyle = {};
  let panelContent;

  switch (target) {
  case 'new':
    panelContent = <NewWish releaseFocus={props.releaseFocus} />;
    break;
  case 'highlight':
    panelContent = <WishDetails wish={props.focus.wish} />;
    break;
  default:
    panelStyle.display = 'none';
    panelContent = <div style={{display: 'none'}}></div>;
  }

  return (
    <div className="panel-wrapper" style={panelStyle}>
      {/* <div className="clearfix"> <button type="button" className="close" onClick={props.releaseFocus}>&times;</button> </div> */}
      <div className="panel-content">
        {panelContent}
      </div>
    </div>
  );
};
PanelWish.propTypes = {
  focus: PropTypes.object.isRequired,
  releaseFocus: PropTypes.func.isRequired
};

class Wishes extends React.Component {
  constructor () {
    super();
    this.state = {
      isLoading: true,
      visibilityFilter: 'all',
      panelFocus: {},
      wishes: []
    };

    this.handlePanelFocusChange = this.handlePanelFocusChange.bind(this);
    this.releasePanelFocus = this.releasePanelFocus.bind(this);
    this.handleClickNewWish = this.handleClickNewWish.bind(this);
    this.handleRemoveWish = this.handleRemoveWish.bind(this);
    this.handleHighlightWish = this.handleHighlightWish.bind(this);
    this.handleUpdateVisbilityFilter = this.handleUpdateVisbilityFilter.bind(this);
    this.onWishCreatedListener = this.onWishCreatedListener.bind(this);
    this.onWishPatchedListener = this.onWishPatchedListener.bind(this);
    this.onWishRemovedListener = this.onWishRemovedListener.bind(this);
  }

  handlePanelFocusChange (focus) {
    this.setState({
      panelFocus: focus
    });
  }

  releasePanelFocus () {
    this.handlePanelFocusChange({});
  }

  handleClickNewWish () {
    this.handlePanelFocusChange({on: 'new'});
  }

  handleRemoveWish (wishId) {
    app.service('wishes').remove(wishId, {})
      .catch(err => { console.warn('Remove wish error: ', err); });
  }

  handleHighlightWish (highlightWish) {
    const wishes = this.state.wishes;
    const highlightWishId = wishes.findIndex(wish => wish._id === highlightWish._id);

    if (highlightWishId !== -1) {
      const shouldHighlight = !highlightWish.highlighted;
      const highlightedWish = Object.assign({}, highlightWish, {highlighted: shouldHighlight});
      // Remove highlight property from wishes as only one can be highlighted at the same time.
      const wishesWithoutHighlight = wishes.map(wish => {
        delete wish.highlighted;
        return wish;
      });

      this.setState({
        wishes: [...wishesWithoutHighlight.slice(0, highlightWishId), highlightedWish, ...wishesWithoutHighlight.slice(highlightWishId + 1)],
        panelFocus: shouldHighlight ? {on: 'highlight', wish: highlightedWish} : {}
      });
    }
  }

  handleUpdateVisbilityFilter (e) {
    this.setState({
      visibilityFilter: e.target.value
    });
  }

  onWishCreatedListener (wish) {
    const wishes = this.state.wishes;

    this.setState({
      wishes: [wish, ...wishes],
      panelFocus: {}
    });
  }

  onWishPatchedListener (patchedWish) {
    const wishes = this.state.wishes;
    const patchedWishIndex = wishes.findIndex(wish => wish._id === patchedWish._id);

    if (patchedWishIndex !== -1) {
      this.setState({
        wishes: [...wishes.slice(0, patchedWishIndex), patchedWish, ...wishes.slice(patchedWishIndex + 1)]
      });
    }
  }

  onWishRemovedListener (removedWish) {
    const wishes = this.state.wishes;
    const removedWishIndex = wishes.findIndex(wish => wish._id === removedWish._id);
    const panelFocus = this.state.panelFocus;

    if (removedWishIndex !== -1) {
      this.setState({
        wishes: [...wishes.slice(0, removedWishIndex), ...wishes.slice(removedWishIndex + 1)]
      });
    }

    if (panelFocus.on && panelFocus.on === 'highlight' &&
        panelFocus.wish && panelFocus.wish._id === removedWish._id) {
      this.setState({
        panelFocus: {}
      });
    }
  }

  componentDidMount () {
    const wishService = app.service('wishes');

    wishService.find({})
      .then(wishes => {
        this.setState({
          isLoading: false,
          wishes: wishes
        });
      })
      .catch(err => {
        console.warn('Wishes, error while fetching wishes: ', err);
      });

    wishService.on('created', this.onWishCreatedListener);
    wishService.on('patched', this.onWishPatchedListener);
    wishService.on('removed', this.onWishRemovedListener);
  }

  componentWillUnmount () {
    const wishService = app.service('wishes');

    wishService.removeListener('created', this.onWishCreatedListener);
    wishService.removeListener('patched', this.onWishPatchedListener);
    wishService.removeListener('removed', this.onWishRemovedListener);
  }

  render () {
    return (
      <div>
        <div className="row mb-2">
          <NewWishButton onClickNewWish={this.handleClickNewWish} />
        </div>
        <div className="row">
          <div className="col-md-6">
            <WishesList
              isLoading={this.state.isLoading}
              visibilityFilter={this.state.visibilityFilter}
              onUpdateVisibilityFilter={this.handleUpdateVisbilityFilter}
              wishes={this.state.wishes}
              onRemove={this.handleRemoveWish}
              onHighlight={this.handleHighlightWish} />
          </div>
          <div className="col-md-6">
            <PanelWish focus={this.state.panelFocus} releaseFocus={this.releasePanelFocus} />
          </div>
        </div>
      </div>
    );
  }
}

export default Wishes;
