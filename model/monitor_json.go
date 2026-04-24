package model

import (
	"database/sql/driver"
	"encoding/json"
	"errors"

	"github.com/QuantumNous/new-api/common"
)

type MonitorJSON []byte

func (j MonitorJSON) validate() error {
	if len(j) == 0 {
		return nil
	}
	if !json.Valid(j) {
		return errors.New("monitor json must be valid JSON")
	}
	return nil
}

func (j MonitorJSON) Value() (driver.Value, error) {
	if len(j) == 0 {
		return nil, nil
	}
	if err := j.validate(); err != nil {
		return nil, err
	}
	return []byte(j), nil
}

func (j *MonitorJSON) Scan(value interface{}) error {
	switch v := value.(type) {
	case nil:
		*j = nil
		return nil
	case []byte:
		buf := make([]byte, len(v))
		copy(buf, v)
		if err := MonitorJSON(buf).validate(); err != nil {
			return err
		}
		*j = MonitorJSON(buf)
		return nil
	case string:
		buf := []byte(v)
		if err := MonitorJSON(buf).validate(); err != nil {
			return err
		}
		*j = MonitorJSON(buf)
		return nil
	default:
		buf, err := common.Marshal(v)
		if err != nil {
			return err
		}
		if err := MonitorJSON(buf).validate(); err != nil {
			return err
		}
		*j = MonitorJSON(buf)
		return nil
	}
}

func (j MonitorJSON) MarshalJSON() ([]byte, error) {
	if len(j) == 0 {
		return []byte("null"), nil
	}
	if err := j.validate(); err != nil {
		return nil, err
	}
	return j, nil
}

func (j *MonitorJSON) UnmarshalJSON(data []byte) error {
	if data == nil {
		*j = nil
		return nil
	}
	if err := MonitorJSON(data).validate(); err != nil {
		return err
	}
	buf := make([]byte, len(data))
	copy(buf, data)
	*j = MonitorJSON(buf)
	return nil
}
