package kubernetes_test

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"statusbay/api"
	"statusbay/api/alerts"
	"statusbay/api/kubernetes"
	"statusbay/api/kubernetes/testutil"
	"statusbay/api/metrics"
	"testing"
)

type testServer struct {
	api *api.Server
}

func MockServer(t *testing.T, storageMockFile string, metrics map[string]metrics.MetricManagerDescriber, alertsClient map[string]alerts.AlertsManagerDescriber) testServer {

	storage := testutil.NewMockStorage()
	return testServer{
		api: api.NewServer(storage, "8080", "api/kubernetes/testutil/events.yaml", metrics, alertsClient),
	}
}

func TestApplicationsData(t *testing.T) {

	ms := MockServer(t, "", nil, nil)
	ms.api.BindEndpoints()
	ms.api.Serve()

	testsResponseCount := []struct {
		endpoint              string
		expectedStatusCode    int
		expectedCountResponse int
	}{
		{"/api/v1/kubernetes/applications", http.StatusOK, 3},
	}

	for _, test := range testsResponseCount {
		t.Run(test.endpoint, func(t *testing.T) {
			rr := httptest.NewRecorder()
			req, err := http.NewRequest("GET", test.endpoint, nil)
			if err != nil {
				t.Fatalf("Http request returned with error")
			}

			ms.api.Router().ServeHTTP(rr, req)
			if rr.Code != test.expectedStatusCode {
				t.Fatalf("handler returned wrong status code: got %v want %v", rr.Code, test.expectedStatusCode)
			}

			if err != nil {
				t.Fatal(err)
			}

			response := &kubernetes.ResponseKubernetesApplicationsCount{}
			body, err := ioutil.ReadAll(rr.Body)
			err = json.Unmarshal(body, &response)
			if len(response.Records) != test.expectedCountResponse {
				t.Fatalf("unexpected deployment events, got %d expected %d", len(response.Records), test.expectedCountResponse)
			}
		})
	}

}