import React, { Component } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';

import { Colors } from '@src/common';
import { NoteItem, ContentEnd, LoadingMore, LoadingError } from '@src/components';
import store from '@src/store';

import { Query, GQL } from  '@src/apollo';

class SevenDaysHot extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fetchingMore: true
    };
  }

  render() {
    let { navigation } = this.props;
    return (
      <View style={styles.container}>
        <Query
          query={GQL.RankingArticleQuery}
          variables={{
            in_days: 7
          }}
        >
          {({ loading, error, data, fetchMore }) => {
            if (error) {
              return <LoadingError reload={() => refetch()} />;
            }
            if (!(data && data.articles)) {
              return null;
            }
            return (
              <FlatList
                data={data.articles}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <NoteItem post={item} />}
                onEndReachedThreshold={0.3}
                onEndReached={() => {
                  if (data.articles) {
                    fetchMore({
                      variables: {
                        offset: data.articles.length
                      },
                      updateQuery: (prev, { fetchMoreResult }) => {
                        if (
                          !(
                            fetchMoreResult &&
                            fetchMoreResult.articles &&
                            fetchMoreResult.articles.length > 0
                          )
                        ) {
                          this.setState({
                            fetchingMore: false
                          });
                          return prev;
                        }
                        return Object.assign({}, prev, {
                          articles: [
                            ...prev.articles,
                            ...fetchMoreResult.articles
                          ]
                        });
                      }
                    });
                  } else {
                    this.setState({
                      fetchingMore: false
                    });
                  }
                }}
                ListFooterComponent={() => {
                  return this.state.fetchingMore ? (
                    <LoadingMore />
                  ) : (
                    <ContentEnd />
                  );
                }}
              />
            );
          }}
        </Query>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.skinColor
  }
});

export default SevenDaysHot;
