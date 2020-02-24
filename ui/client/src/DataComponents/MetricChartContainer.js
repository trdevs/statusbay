import Grid from '@material-ui/core/Grid';
import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { useMetricsData } from '../Hooks/MetricsHooks';
import LineChart from '../components/Charts/Line/LineChart';
import Widget from '../components/Widget/Widget';

const MetricChartContainer = ({
  name, provider, query, deploymentTime,
}) => {
  const { data, loading } = useMetricsData(provider, query, deploymentTime);
  let content;
  if (loading) {
    content = <Skeleton variant="rect" width="auto" height={118} />;
  } else if (data.length === 0) {
    content = (
      <Box display="flex" justifyContent="space-around">
        <Typography variant="h4" color="error">
Metric
        query is invalid
        </Typography>
      </Box>
    );
  } else {
    const series = data.map((item) => ({
      name: item.metric,
      points: item.points,
    }));
    content = <LineChart series={series} deploymentTime={deploymentTime * 1000} />;
  }
  return (
    <Grid key={name} item xs={12} xl={6}>
      <Widget title={name}>
        {content}
      </Widget>
    </Grid>
  );
};
export default React.memo(MetricChartContainer, (prevProps, nextProps) => {
  // optimization: ignore re-render when query and provider didn't changed
  if (prevProps.provider === nextProps.provider && prevProps.query === nextProps.query) {
    return true;
  }
  return prevProps === nextProps;
});
