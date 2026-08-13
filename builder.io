{
  "timestamp": "2026-08-12T19:50:03.211Z",
  "gitHost": "https://github.com",
  "results": [
    {
      "source": "local",
      "testId": "builder.io",
      "target": "https://www.builder.io",
      "passed": true,
      "durationMs": 139,
      "metadata": {
        "browserOutcome": "success",
        "statusCode": 200,
        "statusText": ""
      }
    },
    {
      "source": "local",
      "testId": "builder.codes",
      "target": "https://test.projects.builder.codes/proxy-health",
      "passed": true,
      "durationMs": 209,
      "metadata": {
        "browserOutcome": "success",
        "statusCode": 200,
        "statusText": ""
      }
    },
    {
      "source": "local",
      "testId": "api.builder.io",
      "target": "https://api.builder.io/codegen/health",
      "passed": true,
      "durationMs": 223,
      "metadata": {
        "browserOutcome": "success",
        "statusCode": 200,
        "statusText": ""
      }
    },
    {
      "source": "local",
      "testId": "cdn.builder.io",
      "target": "https://cdn.builder.io/api/v1/image/assets/TEMP/75a212ab82b6175c9862b125e0e23db8d369a58a?width=100",
      "passed": true,
      "durationMs": 151,
      "metadata": {
        "browserOutcome": "success",
        "statusCode": 200,
        "statusText": ""
      }
    },
    {
      "source": "local",
      "testId": "health.builderio.xyz",
      "target": "https://health.builderio.xyz/health",
      "passed": true,
      "durationMs": 211,
      "metadata": {
        "browserOutcome": "success",
        "statusCode": 200,
        "statusText": ""
      }
    },
    {
      "source": "local",
      "testId": "health.builderio.xyz:ws",
      "target": "wss://health.builderio.xyz/ws",
      "passed": true,
      "durationMs": 356
    },
    {
      "source": "local",
      "testId": "health.builderio.dev",
      "target": "https://health.builderio.dev/health",
      "passed": true,
      "durationMs": 215,
      "metadata": {
        "browserOutcome": "success",
        "statusCode": 200,
        "statusText": ""
      }
    },
    {
      "source": "local",
      "testId": "health.builderio.dev:ws",
      "target": "wss://health.builderio.dev/ws",
      "passed": true,
      "durationMs": 717
    },
    {
      "source": "local",
      "testId": "git-host:http",
      "target": "https://github.com",
      "passed": false,
      "durationMs": 470,
      "errorCode": "tcp_connection_refused",
      "metadata": {
        "error": "Failed to fetch",
        "browserOutcome": "error",
        "reachabilityOnly": true,
        "gitProvider": "GitHub"
      }
    },
    {
      "source": "cloud",
      "testId": "git-host:dns",
      "target": "github.com",
      "passed": true,
      "durationMs": 5,
      "metadata": {
        "addresses": [
          "140.82.114.4"
        ],
        "ipVersion": "IPv4",
        "addressCount": 1
      }
    },
    {
      "source": "cloud",
      "testId": "git-host:tcp",
      "target": "github.com:443",
      "passed": true,
      "durationMs": 27,
      "metadata": {
        "hostname": "github.com",
        "port": 443
      }
    },
    {
      "source": "cloud",
      "testId": "git-host:tls",
      "target": "github.com:443",
      "passed": true,
      "durationMs": 59,
      "metadata": {
        "hostname": "github.com",
        "port": 443,
        "certificate": {
          "subject": "CN=github.com",
          "issuer": "CN=Sectigo Public Server Authentication CA DV E36, O=Sectigo Limited, C=GB",
          "validFrom": "Jul  3 00:00:00 2026 GMT",
          "validTo": "Sep 30 23:59:59 2026 GMT",
          "fingerprint": "A5:47:1F:87:66:FE:AF:B2:EE:46:99:70:AE:DA:6C:61:4D:14:B2:1B",
          "serialNumber": "72010E03F4A067FE4E796266430718F6",
          "subjectAltNames": [
            "DNS:github.com",
            "DNS:www.github.com"
          ]
        }
      }
    },
    {
      "source": "cloud",
      "testId": "git-host:http",
      "target": "https://github.com",
      "passed": true,
      "durationMs": 88,
      "metadata": {
        "statusCode": 200,
        "statusText": "OK",
        "latencyHigh": false
      }
    },
    {
      "source": "static-ip",
      "testId": "git-host:dns",
      "target": "github.com",
      "passed": true,
      "durationMs": 0,
      "metadata": {
        "addresses": [
          "140.82.114.4"
        ],
        "ipVersion": "IPv4",
        "addressCount": 1
      }
    },
    {
      "source": "static-ip",
      "testId": "git-host:tcp",
      "target": "github.com:443",
      "passed": true,
      "durationMs": 28,
      "metadata": {
        "hostname": "github.com",
        "port": 443
      }
    },
    {
      "source": "static-ip",
      "testId": "git-host:tls",
      "target": "github.com:443",
      "passed": true,
      "durationMs": 59,
      "metadata": {
        "hostname": "github.com",
        "port": 443,
        "certificate": {
          "subject": "CN=github.com",
          "issuer": "CN=Sectigo Public Server Authentication CA DV E36, O=Sectigo Limited, C=GB",
          "validFrom": "Jul  3 00:00:00 2026 GMT",
          "validTo": "Sep 30 23:59:59 2026 GMT",
          "fingerprint": "A5:47:1F:87:66:FE:AF:B2:EE:46:99:70:AE:DA:6C:61:4D:14:B2:1B",
          "serialNumber": "72010E03F4A067FE4E796266430718F6",
          "subjectAltNames": [
            "DNS:github.com",
            "DNS:www.github.com"
          ]
        }
      }
    },
    {
      "source": "static-ip",
      "testId": "git-host:http",
      "target": "https://github.com",
      "passed": true,
      "durationMs": 87,
      "metadata": {
        "statusCode": 200,
        "statusText": "OK",
        "latencyHigh": false
      }
    }
  ],
  "analysis": {
    "recommendation": "fix_local_firewall",
    "reason": "Connections to https://github.com are being blocked on your network.",
    "steps": [
      "Connections are being blocked, likely by a firewall.",
      "Check your local firewall settings and allow outbound connections.",
      "If on a corporate network, contact your IT administrator to allow access to Builder.io services.",
      "Ensure outbound connections to https://github.com are permitted."
    ],
    "likelyCause": "firewall_blocking",
    "summary": {
      "localToBuilder": "pass",
      "localToGitHost": "fail",
      "cloudToGitHost": "pass",
      "staticIpToGitHost": "pass",
      "vpcToGitHost": "unknown"
    },
    "allResults": [
      {
        "source": "local",
        "testId": "builder.io",
        "target": "https://www.builder.io",
        "passed": true,
        "durationMs": 139,
        "metadata": {
          "browserOutcome": "success",
          "statusCode": 200,
          "statusText": ""
        }
      },
      {
        "source": "local",
        "testId": "builder.codes",
        "target": "https://test.projects.builder.codes/proxy-health",
        "passed": true,
        "durationMs": 209,
        "metadata": {
          "browserOutcome": "success",
          "statusCode": 200,
          "statusText": ""
        }
      },
      {
        "source": "local",
        "testId": "api.builder.io",
        "target": "https://api.builder.io/codegen/health",
        "passed": true,
        "durationMs": 223,
        "metadata": {
          "browserOutcome": "success",
          "statusCode": 200,
          "statusText": ""
        }
      },
      {
        "source": "local",
        "testId": "cdn.builder.io",
        "target": "https://cdn.builder.io/api/v1/image/assets/TEMP/75a212ab82b6175c9862b125e0e23db8d369a58a?width=100",
        "passed": true,
        "durationMs": 151,
        "metadata": {
          "browserOutcome": "success",
          "statusCode": 200,
          "statusText": ""
        }
      },
      {
        "source": "local",
        "testId": "health.builderio.xyz",
        "target": "https://health.builderio.xyz/health",
        "passed": true,
        "durationMs": 211,
        "metadata": {
          "browserOutcome": "success",
          "statusCode": 200,
          "statusText": ""
        }
      },
      {
        "source": "local",
        "testId": "health.builderio.xyz:ws",
        "target": "wss://health.builderio.xyz/ws",
        "passed": true,
        "durationMs": 356
      },
      {
        "source": "local",
        "testId": "health.builderio.dev",
        "target": "https://health.builderio.dev/health",
        "passed": true,
        "durationMs": 215,
        "metadata": {
          "browserOutcome": "success",
          "statusCode": 200,
          "statusText": ""
        }
      },
      {
        "source": "local",
        "testId": "health.builderio.dev:ws",
        "target": "wss://health.builderio.dev/ws",
        "passed": true,
        "durationMs": 717
      },
      {
        "source": "local",
        "testId": "git-host:http",
        "target": "https://github.com",
        "passed": false,
        "durationMs": 470,
        "errorCode": "tcp_connection_refused",
        "metadata": {
          "error": "Failed to fetch",
          "browserOutcome": "error",
          "reachabilityOnly": true,
          "gitProvider": "GitHub"
        }
      },
      {
        "source": "cloud",
        "testId": "git-host:dns",
        "target": "github.com",
        "passed": true,
        "durationMs": 5,
        "metadata": {
          "addresses": [
            "140.82.114.4"
          ],
          "ipVersion": "IPv4",
          "addressCount": 1
        }
      },
      {
        "source": "cloud",
        "testId": "git-host:tcp",
        "target": "github.com:443",
        "passed": true,
        "durationMs": 27,
        "metadata": {
          "hostname": "github.com",
          "port": 443
        }
      },
      {
        "source": "cloud",
        "testId": "git-host:tls",
        "target": "github.com:443",
        "passed": true,
        "durationMs": 59,
        "metadata": {
          "hostname": "github.com",
          "port": 443,
          "certificate": {
            "subject": "CN=github.com",
            "issuer": "CN=Sectigo Public Server Authentication CA DV E36, O=Sectigo Limited, C=GB",
            "validFrom": "Jul  3 00:00:00 2026 GMT",
            "validTo": "Sep 30 23:59:59 2026 GMT",
            "fingerprint": "A5:47:1F:87:66:FE:AF:B2:EE:46:99:70:AE:DA:6C:61:4D:14:B2:1B",
            "serialNumber": "72010E03F4A067FE4E796266430718F6",
            "subjectAltNames": [
              "DNS:github.com",
              "DNS:www.github.com"
            ]
          }
        }
      },
      {
        "source": "cloud",
        "testId": "git-host:http",
        "target": "https://github.com",
        "passed": true,
        "durationMs": 88,
        "metadata": {
          "statusCode": 200,
          "statusText": "OK",
          "latencyHigh": false
        }
      },
      {
        "source": "static-ip",
        "testId": "git-host:dns",
        "target": "github.com",
        "passed": true,
        "durationMs": 0,
        "metadata": {
          "addresses": [
            "140.82.114.4"
          ],
          "ipVersion": "IPv4",
          "addressCount": 1
        }
      },
      {
        "source": "static-ip",
        "testId": "git-host:tcp",
        "target": "github.com:443",
        "passed": true,
        "durationMs": 28,
        "metadata": {
          "hostname": "github.com",
          "port": 443
        }
      },
      {
        "source": "static-ip",
        "testId": "git-host:tls",
        "target": "github.com:443",
        "passed": true,
        "durationMs": 59,
        "metadata": {
          "hostname": "github.com",
          "port": 443,
          "certificate": {
            "subject": "CN=github.com",
            "issuer": "CN=Sectigo Public Server Authentication CA DV E36, O=Sectigo Limited, C=GB",
            "validFrom": "Jul  3 00:00:00 2026 GMT",
            "validTo": "Sep 30 23:59:59 2026 GMT",
            "fingerprint": "A5:47:1F:87:66:FE:AF:B2:EE:46:99:70:AE:DA:6C:61:4D:14:B2:1B",
            "serialNumber": "72010E03F4A067FE4E796266430718F6",
            "subjectAltNames": [
              "DNS:github.com",
              "DNS:www.github.com"
            ]
          }
        }
      },
      {
        "source": "static-ip",
        "testId": "git-host:http",
        "target": "https://github.com",
        "passed": true,
        "durationMs": 87,
        "metadata": {
          "statusCode": 200,
          "statusText": "OK",
          "latencyHigh": false
        }
      }
    ],
    "timestamp": "2026-08-12T19:49:58.064Z",
    "gitHost": "https://github.com",
    "localResults": [
      {
        "source": "local",
        "testId": "builder.io",
        "target": "https://www.builder.io",
        "passed": true,
        "durationMs": 139,
        "metadata": {
          "browserOutcome": "success",
          "statusCode": 200,
          "statusText": ""
        }
      },
      {
        "source": "local",
        "testId": "builder.codes",
        "target": "https://test.projects.builder.codes/proxy-health",
        "passed": true,
        "durationMs": 209,
        "metadata": {
          "browserOutcome": "success",
          "statusCode": 200,
          "statusText": ""
        }
      },
      {
        "source": "local",
        "testId": "api.builder.io",
        "target": "https://api.builder.io/codegen/health",
        "passed": true,
        "durationMs": 223,
        "metadata": {
          "browserOutcome": "success",
          "statusCode": 200,
          "statusText": ""
        }
      },
      {
        "source": "local",
        "testId": "cdn.builder.io",
        "target": "https://cdn.builder.io/api/v1/image/assets/TEMP/75a212ab82b6175c9862b125e0e23db8d369a58a?width=100",
        "passed": true,
        "durationMs": 151,
        "metadata": {
          "browserOutcome": "success",
          "statusCode": 200,
          "statusText": ""
        }
      },
      {
        "source": "local",
        "testId": "health.builderio.xyz",
        "target": "https://health.builderio.xyz/health",
        "passed": true,
        "durationMs": 211,
        "metadata": {
          "browserOutcome": "success",
          "statusCode": 200,
          "statusText": ""
        }
      },
      {
        "source": "local",
        "testId": "health.builderio.xyz:ws",
        "target": "wss://health.builderio.xyz/ws",
        "passed": true,
        "durationMs": 356
      },
      {
        "source": "local",
        "testId": "health.builderio.dev",
        "target": "https://health.builderio.dev/health",
        "passed": true,
        "durationMs": 215,
        "metadata": {
          "browserOutcome": "success",
          "statusCode": 200,
          "statusText": ""
        }
      },
      {
        "source": "local",
        "testId": "health.builderio.dev:ws",
        "target": "wss://health.builderio.dev/ws",
        "passed": true,
        "durationMs": 717
      },
      {
        "source": "local",
        "testId": "git-host:http",
        "target": "https://github.com",
        "passed": false,
        "durationMs": 470,
        "errorCode": "tcp_connection_refused",
        "metadata": {
          "error": "Failed to fetch",
          "browserOutcome": "error",
          "reachabilityOnly": true,
          "gitProvider": "GitHub"
        }
      }
    ],
    "serverResults": [
      {
        "source": "cloud",
        "testId": "git-host:dns",
        "target": "github.com",
        "passed": true,
        "durationMs": 5,
        "metadata": {
          "addresses": [
            "140.82.114.4"
          ],
          "ipVersion": "IPv4",
          "addressCount": 1
        }
      },
      {
        "source": "cloud",
        "testId": "git-host:tcp",
        "target": "github.com:443",
        "passed": true,
        "durationMs": 27,
        "metadata": {
          "hostname": "github.com",
          "port": 443
        }
      },
      {
        "source": "cloud",
        "testId": "git-host:tls",
        "target": "github.com:443",
        "passed": true,
        "durationMs": 59,
        "metadata": {
          "hostname": "github.com",
          "port": 443,
          "certificate": {
            "subject": "CN=github.com",
            "issuer": "CN=Sectigo Public Server Authentication CA DV E36, O=Sectigo Limited, C=GB",
            "validFrom": "Jul  3 00:00:00 2026 GMT",
            "validTo": "Sep 30 23:59:59 2026 GMT",
            "fingerprint": "A5:47:1F:87:66:FE:AF:B2:EE:46:99:70:AE:DA:6C:61:4D:14:B2:1B",
            "serialNumber": "72010E03F4A067FE4E796266430718F6",
            "subjectAltNames": [
              "DNS:github.com",
              "DNS:www.github.com"
            ]
          }
        }
      },
      {
        "source": "cloud",
        "testId": "git-host:http",
        "target": "https://github.com",
        "passed": true,
        "durationMs": 88,
        "metadata": {
          "statusCode": 200,
          "statusText": "OK",
          "latencyHigh": false
        }
      },
      {
        "source": "static-ip",
        "testId": "git-host:dns",
        "target": "github.com",
        "passed": true,
        "durationMs": 0,
        "metadata": {
          "addresses": [
            "140.82.114.4"
          ],
          "ipVersion": "IPv4",
          "addressCount": 1
        }
      },
      {
        "source": "static-ip",
        "testId": "git-host:tcp",
        "target": "github.com:443",
        "passed": true,
        "durationMs": 28,
        "metadata": {
          "hostname": "github.com",
          "port": 443
        }
      },
      {
        "source": "static-ip",
        "testId": "git-host:tls",
        "target": "github.com:443",
        "passed": true,
        "durationMs": 59,
        "metadata": {
          "hostname": "github.com",
          "port": 443,
          "certificate": {
            "subject": "CN=github.com",
            "issuer": "CN=Sectigo Public Server Authentication CA DV E36, O=Sectigo Limited, C=GB",
            "validFrom": "Jul  3 00:00:00 2026 GMT",
            "validTo": "Sep 30 23:59:59 2026 GMT",
            "fingerprint": "A5:47:1F:87:66:FE:AF:B2:EE:46:99:70:AE:DA:6C:61:4D:14:B2:1B",
            "serialNumber": "72010E03F4A067FE4E796266430718F6",
            "subjectAltNames": [
              "DNS:github.com",
              "DNS:www.github.com"
            ]
          }
        }
      },
      {
        "source": "static-ip",
        "testId": "git-host:http",
        "target": "https://github.com",
        "passed": true,
        "durationMs": 87,
        "metadata": {
          "statusCode": 200,
          "statusText": "OK",
          "latencyHigh": false
        }
      }
    ]
  }
}
