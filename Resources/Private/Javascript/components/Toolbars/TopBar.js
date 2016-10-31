import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../../actions/contentActions';
import { isEmpty } from '../../localStorage';

const mapStateToProps = (state) => {
    return {
        unsavedElements: state.unsavedElements,
        saving: state.saving
    }
}

class TopBar extends React.Component {

    saveAllChanges () {
        this.props.dispatch(actions.saveAllChanges());
    }

    discardAllChanges () {
        if (!isEmpty() && confirm(FrontendEditing.labels['notifications.remove-all-changes'])) {
            this.props.dispatch(actions.discardAllChanges());
        }
    }

    render () {
        const numberOfUnsavedElements = Object.keys(this.props.unsavedElements).length;
        const textForNumberOfUnsavedElements = numberOfUnsavedElements  === 0 ? '' : `(${numberOfUnsavedElements})`;
        return (
            <div className="t3-frontend-editing__top-bar">
                <div className="t3-frontend-editing__topbar-inner">
                    <div className="t3-frontend-editing__top-bar-left">
                        <div className="back-backend">
                            <a href="/typo3">
                                <span className="icons icon-icons-back"></span>
                                <span title="{FrontendEditing.labels['top-bar.to-backend']}">
                                    {FrontendEditing.labels['top-bar.to-backend']}
                                </span>
                            </a>
                        </div>
                    </div>
                    <div className="t3-frontend-editing__top-bar-right">
                        <ul className="top-bar-items">
                            <li className="dropdown item">
                                <div className="user">
                                    <span dangerouslySetInnerHTML={{__html: FrontendEditing.userIcon}} />
                                    <span title={FrontendEditing.userName}>{FrontendEditing.userName}</span>
                                </div>
                            </li>
                        </ul>
                        <div className="top-bar-action-buttons">
                            <button disabled={this.props.saving} onClick={this.saveAllChanges.bind(this)} type="submit" className="t3-frontend-editing__save btn">
                                <span className="btn-text">
                                    {FrontendEditing.labels['top-bar.save-all']}
                                </span>
                                <span className="items-counter btn-text">{textForNumberOfUnsavedElements}</span>
                                <span className="icons icon-icons-save"></span>
                            </button>
                            <button disabled={this.props.saving} onClick={this.discardAllChanges.bind(this)} type="#" className="t3-frontend-editing__discard btn-default">
                                <span className="btn-text">
                                    {FrontendEditing.labels['top-bar.discard-all']}
                                </span>
                                <span className="icons icon-icons-cancel"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

TopBar.propTypes = {
    dispatch: React.PropTypes.func,
    unsavedElements: React.PropTypes.object,
    saving: React.PropTypes.bool
};

export default connect(mapStateToProps)(TopBar);