// @flow
import React, { PureComponent } from 'react'
import { ScrollView, Image, StyleSheet, Text } from 'react-native'
import { StackNavigator } from 'react-navigation'
import { connect } from 'react-redux'
import { List, ListItem } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'
import moment from 'moment'
import groupBy from 'lodash.groupby'

import {
  InfoSectionList,
  ClaimProofHeader,
  Container,
  ConnectionTheme,
  CustomView,
  Icon,
  CustomText,
  Separator,
  CustomDate,
} from '../components'
import {
  connectionHistoryRoute,
  connectionHistoryDetailsRoute,
  connectionHistoryPendingRoute,
} from '../common/route-constants'
import { homeRoute } from '../common/index'
import { color, OFFSET_1X, OFFSET_3X } from '../common/styles/constant'
import type { Store } from '../store/type-store'
import type { ConnectionHistoryItem } from './type-connection-history'
import {
  HISTORY_EVENT_STATUS,
  HISTORY_EVENT_OCCURRED,
} from './type-connection-history'
import {
  SEND_CLAIM_REQUEST,
  CLAIM_REQUEST_STATUS,
} from '../claim-offer/type-claim-offer'

const statusMsg = {
  ['PENDING']: 'Pending',
  ['CONNECTED']: 'Established on',
  ['RECEIVED']: 'Accepted on',
  ['ACCEPTED & SAVED']: 'Accepted on',
  ['SHARED']: 'Sent on',
}

const historyIcons = {
  ['PENDING']: require('../images/received.png'),
  ['CONNECTED']: require('../images/linked.png'),
  ['RECEIVED']: require('../images/received.png'),
  ['ACCEPTED & SAVED']: require('../images/received.png'),
  ['SHARED']: require('../images/sent.png'),
}

const HistoryTitle = ({ action, name, theme }) => (
  <CustomView row>
    <CustomText
      h5
      semiBold
      uppercase
      bg="fifth"
      style={[styles.listItemAction, { color: theme }]}
    >
      {action}
    </CustomText>
    {name && (
      <CustomText h5 semiBold bg="fifth" style={[styles.listItemTitleEvent]}>
        {` - ${name}`}
      </CustomText>
    )}
  </CustomView>
)

const HistoryBody = ({ action, timestamp }) => {
  return (
    <CustomView row>
      <CustomDate
        format="MM/DD/YYYY | h:mm A"
        h7
        uppercase
        bg="fifth"
        style={[styles.listItemBody]}
      >
        {timestamp}
      </CustomDate>
    </CustomView>
  )
}

export class ConnectionHistory extends PureComponent {
  connectionDetailHandler = (history: any) => {
    if (history.h.action === HISTORY_EVENT_STATUS[SEND_CLAIM_REQUEST]) {
      this.props.navigation.navigate(connectionHistoryPendingRoute, {
        payload: history.h.originalPayload.payload,
      })
    } else {
      this.props.navigation.navigate(connectionHistoryDetailsRoute, {
        ...history.h,
        theme: history.activeConnectionThemePrimary,
        senderName: history.senderName,
        image: history.image,
        senderDID: history.senderDID,
        claimMap: this.props.claimMap,
      })
    }
  }

  close = () => {
    this.props.navigation.navigate(homeRoute)
  }

  render() {
    const { senderName, image, senderDID } = this.props.navigation.state.params
    const { activeConnectionThemePrimary, connectionHistory } = this.props
    const testID = 'connection-history'
    const logoUri = image ? { uri: image } : require('../images/cb_evernym.png')
    const historySenderDIDs = Object.keys(connectionHistory)

    const historyList = historySenderDIDs.map((sdid, i) => {
      const historyItems = connectionHistory[sdid].map((h, i) => {
        const itemProps = {
          avatar: historyIcons[h.action],
          key: h.id,
          title: <HistoryTitle {...h} theme={activeConnectionThemePrimary} />,
          subtitle: <HistoryBody {...h} />,
          chevronColor: color.bg.fifth.font.fifth,
          avatarStyle: styles.avatarStyle,
          containerStyle: styles.listItemContainer,
          hideChevron: false,
          rightIcon: {
            name:
              h.action === HISTORY_EVENT_STATUS[SEND_CLAIM_REQUEST]
                ? 'schedule'
                : 'chevron-right',
          },
          onPress: () => {
            this.connectionDetailHandler({
              h,
              activeConnectionThemePrimary,
              senderName,
              image,
              senderDID,
            })
          },
        }

        if (h.action === 'CONNECTED') {
          itemProps.hideChevron = true
          delete itemProps.onPress
        }

        return <ListItem {...itemProps} />
      })
      const history = (
        <CustomView key={i}>
          <CustomText h4 semiBold bg="tertiary" style={[styles.listItemLabel]}>
            {sdid}
          </CustomText>
          {historyItems}
        </CustomView>
      )
      return history
    })

    return (
      <Container fifth>
        <LinearGradient
          locations={[0.1, 1]}
          colors={[
            this.props.activeConnectionThemeSecondary,
            this.props.activeConnectionThemePrimary,
          ]}
        >
          <ClaimProofHeader
            message={senderName}
            onClose={this.close}
            logoUrl={image}
            testID={testID}
            containerStyle={{ backgroundColor: 'transparent' }}
            textContainerStyle={[
              styles.textContainerStyle,
              { backgroundColor: 'transparent' },
            ]}
            messageStyle={[
              styles.senderName,
              { backgroundColor: 'transparent' },
            ]}
          >
            <CustomView
              fifth
              hCenter
              style={[
                styles.headerLogoContainer,
                { backgroundColor: 'transparent' },
              ]}
            >
              <Icon
                absolute="TopRight"
                src={require('../images/close_white.png')}
                small
                testID={`${testID}-icon-close`}
                onPress={this.close}
                iconStyle={[styles.headerCloseIcon]}
                style={[styles.headerCloseIconContainer]}
              />
              <Icon
                center
                halo
                extraLarge
                resizeMode="cover"
                src={logoUri}
                style={[styles.issuerLogo]}
                iconStyle={[styles.issuerLogoIcon]}
                testID={`${testID}-issuer-logo`}
              />
            </CustomView>
          </ClaimProofHeader>
        </LinearGradient>

        <ScrollView>
          <List containerStyle={styles.listContainer}>{historyList}</List>
        </ScrollView>
      </Container>
    )
  }
}

const mapStateToProps = (state: Store, props: any) => {
  let connectionHistory = state.history.data
    ? state.history.data[props.navigation.state.params.senderDID]
    : {}
  if (connectionHistory) {
    connectionHistory = connectionHistory.filter(history => {
      if (statusMsg[history.action]) {
        return history
      }
    })
  }
  return {
    activeConnectionThemePrimary:
      state.connections.connectionThemes.active.primary,
    activeConnectionThemeSecondary:
      state.connections.connectionThemes.active.secondary,
    connectionHistory: groupBy(
      connectionHistory.sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp)
      }),
      history => moment(history.timestamp).format('MMMM YYYY')
    ),
    claimMap: state.claim.claimMap,
  }
}

export default connect(mapStateToProps)(ConnectionHistory)

const styles = StyleSheet.create({
  headerCloseIcon: {
    marginRight: 15,
  },
  headerCloseIconContainer: {
    zIndex: 2,
  },
  headerLogoContainer: {
    height: 90,
  },
  issuerLogo: {
    ...StyleSheet.absoluteFillObject,
    alignSelf: 'center',
    height: 80,
    zIndex: 1,
  },
  textContainerStyle: {
    paddingBottom: 0,
    marginBottom: OFFSET_3X / 2,
  },
  senderName: {
    marginTop: OFFSET_1X / 2,
    color: color.bg.primary.font.primary,
  },
  issuerLogoIcon: {
    borderRadius: 40,
  },
  listContainer: {
    marginTop: 0,
    borderBottomWidth: 0,
  },
  listItemLabel: {
    paddingLeft: OFFSET_3X / 2,
    paddingVertical: OFFSET_1X,
  },
  listItemContainer: {
    borderBottomWidth: 2,
  },
  listItemAction: {
    marginLeft: OFFSET_1X,
    marginBottom: OFFSET_1X / 2,
  },
  listItemTitleEvent: {
    color: color.bg.fifth.font.fifth,
  },
  listItemBody: {
    marginLeft: OFFSET_1X,
  },
  avatarStyle: {
    width: 17,
    height: 17,
    marginVertical: OFFSET_1X,
    resizeMode: 'contain',
  },
})
