const kinds = {
  Deployment: 'deployment',
  DaemonSet: 'daemonSet',
  StatefulSet: 'statefulSet',
};

const createDeploymentData = ([name, rawData]) => {
  return {
    name: name,
    type: kinds.Deployment,
    stats: transformers.status(rawData),
    // replicaSets: [],
    deploymentEvents: transformers.deploymentEvents(rawData),
    podEvents: transformers.podEvents(rawData),
  
  }
}
const createDaemonSetData = ([name, rawData]) => {
  return {
    name: name,
    type: kinds.DaemonSet,
    stats: transformers.status(rawData),
    // replicaSets: [],
    deploymentEvents: transformers.daemonSetEvents(rawData),
    podEvents: transformers.podEvents(rawData),
  
  }
}

const createStatefulSetData = ([name, rawData]) => {
  return {
    name: name,
    type: kinds.StatefulSet,
    stats: transformers.status(rawData),
    deploymentEvents: transformers.statefulSetEvents(rawData),
    podEvents: transformers.podEvents(rawData),
  }
}

const convertDeploymentDetailsData = (data) => {
  return {
    name: data.Name,
    status: data.Status,
    time: data.Time,
    namespace: data.Namespace,
    cluster: data.Cluster,
    kinds: [
      ...Object.entries(data.Details.Resources.Deployments).map(createDeploymentData),
      ...Object.entries(data.Details.Resources.Daemonsets).map(createDaemonSetData),
      ...Object.entries(data.Details.Resources.Statefulsets).map(createStatefulSetData),
    ]
  }
};
const transformers = {
  status: (rawData) => {
    return {
      desired: rawData.Status.ObservedGeneration,
      current: rawData.Status.Replicas,
      updated: rawData.Status.UpdatedReplicas,
      ready: rawData.Status.ReadyReplicas,
      available: rawData.Status.AvailableReplicas,
      unavailable: rawData.Status.UnavailableReplicas,
    }
  },
  deploymentEvents: (rawData) => {
    return rawData.Events.map(event => {
      return {
        title: event.Message,
        time: event.Time,
        content: event.MarkDescriptions && event.MarkDescriptions.length > 0 && event.MarkDescriptions[0],
        error: event.MarkDescriptions ? event.MarkDescriptions.length > 0 : false,
      }
    })
  },
  daemonSetEvents: (rawData) => {
    return rawData.Events.map(event => {
      return {
        title: event.Message,
        time: event.Time,
        content: event.MarkDescriptions && event.MarkDescriptions.length > 0 && event.MarkDescriptions[0],
        error: event.MarkDescriptions ? event.MarkDescriptions.length > 0 : false,
      }
    })
  },
  statefulSetEvents: (rawData) => {
    return rawData.Events.map(event => {
      return {
        title: event.Message,
        time: event.Time,
        content: event.MarkDescriptions && event.MarkDescriptions.length > 0 && event.MarkDescriptions[0],
        error: event.MarkDescriptions ? event.MarkDescriptions.length > 0 : false,
      }
    })
  },
  podEvents: (rawData) => {
    return Object.entries(rawData.Pods).map(([name, pod]) => {
      return {
        name,
        status: pod.Phase.toLowerCase(),
        time: pod.CreationTimestamp,
        logs: pod.Events.map(event => {
          return {
            title: event.Message,
            time: event.Time,
            content: event.MarkDescriptions && event.MarkDescriptions.length > 0 && event.MarkDescriptions[0],
            error: event.MarkDescriptions ? event.MarkDescriptions.length > 0 : false,
          }
        })
      }
    })
  }
}

module.exports = {convertDeploymentDetailsData};