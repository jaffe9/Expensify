import React from 'react';
import {View, Pressable} from 'react-native';
import PropTypes from 'prop-types';
import {withOnyx} from 'react-native-onyx';
import _ from 'underscore';
import lodashGet from 'lodash/get';
import Text from '../Text';
import Icon from '../Icon';
import * as Expensicons from '../Icon/Expensicons';
import styles from '../../styles/styles';
import reportActionPropTypes from '../../pages/home/report/reportActionPropTypes';
import withLocalize, {withLocalizePropTypes} from '../withLocalize';
import compose from '../../libs/compose';
import CONST from '../../CONST';
import ONYXKEYS from '../../ONYXKEYS';
import ControlSelection from '../../libs/ControlSelection';
import * as DeviceCapabilities from '../../libs/DeviceCapabilities';
import {showContextMenuForReport} from '../ShowContextMenuContext';
import * as StyleUtils from '../../styles/StyleUtils';
import * as CurrencyUtils from '../../libs/CurrencyUtils';
import getButtonState from '../../libs/getButtonState';

const propTypes = {
    /** All the data of the action */
    action: PropTypes.shape(reportActionPropTypes).isRequired,

    /** The associated chatReport */
    chatReportID: PropTypes.string.isRequired,

    /** The active IOUReport, used for Onyx subscription */
    // eslint-disable-next-line react/no-unused-prop-types
    iouReportID: PropTypes.string.isRequired,

    /** Popover context menu anchor, used for showing context menu */
    contextMenuAnchor: PropTypes.shape({current: PropTypes.elementType}),

    /** Callback invoked when View Details is pressed */
    onViewDetailsPressed: PropTypes.func,

    /** Callback for updating context menu active state, used for showing context menu */
    checkIfContextMenuActive: PropTypes.func,

    /** Whether the IOU is hovered so we can modify its style */
    isHovered: PropTypes.bool,

    ...withLocalizePropTypes,
};

const defaultProps = {
    contextMenuAnchor: null,
    isHovered: false,
    onViewDetailsPressed: () => {},
    checkIfContextMenuActive: () => {},
};

const IOUQuote = (props) => {
    return (
        <View style={[styles.chatItemMessage, styles.mt4]}>
            {_.map(props.action.message, (fragment, index) => (
                <Pressable
                    key={`iouQuote-${props.action.reportActionID}-${index}`}
                    onPress={props.onViewDetailsPressed}
                    onPressIn={() => DeviceCapabilities.canUseTouchScreen() && ControlSelection.block()}
                    onPressOut={() => ControlSelection.unblock()}
                    onLongPress={event => showContextMenuForReport(
                        event,
                        props.contextMenuAnchor,
                        props.chatReportID,
                        props.action,
                        props.checkIfContextMenuActive,
                    )}
                    style={[styles.flexRow, styles.justifyContentBetween]}
                    focusable
                >
                     <Text style={[styles.flex1, styles.mr2]}>
                        <Text style={styles.chatItemMessageLink}>
                            {/* Get first word of IOU message */}
                            {fragment.text.split(' ')[0]}
                        </Text>
                        <Text style={[styles.chatItemMessage, styles.cursorPointer]}>
                            {/* Get remainder of IOU message */}
                            {fragment.text.substring(fragment.text.indexOf(' '))}
                        </Text>
                    </Text>
                    <Icon src={Expensicons.ArrowRight} fill={StyleUtils.getIconFillColor(getButtonState(props.isHovered))} />
                </Pressable>
            ))}
        </View>
    )
};

IOUQuote.propTypes = propTypes;
IOUQuote.defaultProps = defaultProps;
IOUQuote.displayName = 'IOUQuote';

export default compose(
    withLocalize,
    withOnyx({
        iouReport: {
            key: ({iouReportID}) => `${ONYXKEYS.COLLECTION.REPORT}${iouReportID}`,
        },
    }),
)(IOUQuote);
