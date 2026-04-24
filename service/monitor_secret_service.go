package service

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"errors"
	"fmt"
	"io"

	"github.com/QuantumNous/new-api/common"
)

var errMonitorCryptoSecretRequired = errors.New("crypto secret is required for monitor target encryption")

func EncryptMonitorTargetAPIKey(plain string) (string, error) {
	if plain == "" {
		return "", nil
	}
	if common.CryptoSecret == "" {
		return "", errMonitorCryptoSecretRequired
	}
	block, err := aes.NewCipher(monitorSecretKey())
	if err != nil {
		return "", err
	}
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}
	nonce := make([]byte, gcm.NonceSize())
	if _, err = io.ReadFull(rand.Reader, nonce); err != nil {
		return "", err
	}
	sealed := gcm.Seal(nonce, nonce, []byte(plain), nil)
	return base64.StdEncoding.EncodeToString(sealed), nil
}

func DecryptMonitorTargetAPIKey(ciphertext string) (string, error) {
	if ciphertext == "" {
		return "", nil
	}
	if common.CryptoSecret == "" {
		return "", errMonitorCryptoSecretRequired
	}
	raw, err := base64.StdEncoding.DecodeString(ciphertext)
	if err != nil {
		return "", fmt.Errorf("decode monitor target api key: %w", err)
	}
	block, err := aes.NewCipher(monitorSecretKey())
	if err != nil {
		return "", err
	}
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}
	if len(raw) < gcm.NonceSize() {
		return "", errors.New("monitor target api key ciphertext is too short")
	}
	nonce := raw[:gcm.NonceSize()]
	payload := raw[gcm.NonceSize():]
	plain, err := gcm.Open(nil, nonce, payload, nil)
	if err != nil {
		return "", fmt.Errorf("decrypt monitor target api key: %w", err)
	}
	return string(plain), nil
}

func monitorSecretKey() []byte {
	sum := sha256.Sum256([]byte(common.CryptoSecret))
	return sum[:]
}
