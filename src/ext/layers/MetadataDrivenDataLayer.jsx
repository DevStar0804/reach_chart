import React from 'react';
import PureRender from 'pure-render-decorator';
import _ from 'lodash';

import BucketedLineLayer from '../../core/layers/BucketedLineLayer';
import PointLayer from '../../core/layers/PointLayer';
import SimpleLineLayer from '../../core/layers/SimpleLineLayer';
import TimeSpanLayer from '../../core/layers/TimeSpanLayer';

import LayerType from '../LayerType';
import propTypes from '../../core/propTypes';

const LAYER_BY_TYPE = {
  [LayerType.SIMPLE_LINE]: SimpleLineLayer,
  [LayerType.BUCKETED_LINE]: BucketedLineLayer,
  [LayerType.POINT]: PointLayer,
  [LayerType.TIME_SPAN]: TimeSpanLayer
};

@PureRender
class MetadataDrivenDataLayer extends React.Component {
  static propTypes = {
    xDomain: propTypes.range.isRequired,
    yDomainBySeriesId: React.PropTypes.objectOf(propTypes.range).isRequired,
    metadataBySeriesId: React.PropTypes.objectOf(React.PropTypes.object).isRequired,
    dataBySeriesId: React.PropTypes.object.isRequired,
    seriesIds: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
  };

  render() {
    return (
      <div className='layer metadata-driven-data-layer'>
        {this.props.seriesIds.map(this._getLayerForSeriesId)}
      </div>
    );
  }

  _getLayerForSeriesId = (seriesId) => {
    const metadata = this.props.metadataBySeriesId[seriesId] || {};

    const baseLayerProps = _.extend({
      xDomain: this.props.xDomain,
      yDomain: this.props.yDomainBySeriesId[seriesId]
    }, metadata);

    if (metadata.layerType === LayerType.GROUP) {
      return <div className='layer-group' key={seriesId}>
        {metadata.groupedSeries.map(({ seriesId, layerType}) =>
          this._renderBaseLayer(layerType, seriesId, baseLayerProps)
        )}
      </div>
    } else {
      return this._renderBaseLayer(metadata.layerType, seriesId, baseLayerProps);
    }
  }

  _renderBaseLayer(layerType, seriesId, baseLayerProps) {
    const LayerClass = LAYER_BY_TYPE[layerType];
    if (LayerClass) {
      return <LayerClass {...baseLayerProps} key={seriesId} data={this.props.dataBySeriesId[seriesId]}/>
    } else {
      console.warn('not rendering data layer of unknown type ' + metadata.layerType);
      return null;
    }
  }
}

export default MetadataDrivenDataLayer;
