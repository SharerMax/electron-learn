import { describe, expect, test } from 'vitest'
import { parseHttpUri, parseShadowsocksLegacyUri, parseShadowsocksSIP002URI, parseSocksUri, parseTrojanUri } from '../../utils/parse'
import type { OrdinaryTrojanProxy, TrojanWebsocketProxy } from '@/share/type'

describe('utils:parse', () => {
  test('parseShadowsocksSIP002UR', () => {
    const result = parseShadowsocksSIP002URI('ss://cmM0LW1kNTpwYXNzd2Q@us.proxy.com:8888#Example2')
    expect(result).toEqual({
      type: 'ss',
      name: 'Example2',
      server: 'us.proxy.com',
      cipher: 'rc4-md5',
      password: 'passwd',
      port: 8888,
    })
    const withV2rayResult = parseShadowsocksSIP002URI('ss://MjAyMi1ibGFrZTMtYWVzLTI1Ni1nY206WWN0UFo2VTd4UFBjVSUyQmdwM3UlMkIwdHglMkZ0Uml6Sk45Szh5JTJCdUtsVzJxamxJJTNE@192.168.100.1:8888/?plugin=v2ray-plugin%3Btls%3Bhost%3Dcn.bing.com#Example3')
    expect(withV2rayResult).toEqual({
      'type': 'ss',
      'name': 'Example3',
      'server': '192.168.100.1',
      'cipher': '2022-blake3-aes-256-gcm',
      'password': 'YctPZ6U7xPPcU+gp3u+0tx/tRizJN9K8y+uKlW2qjlI=',
      'port': 8888,
      'plugin': 'v2ray-plugin',
      'plugin-opt': {
        mode: 'websocket',
        host: 'cn.bing.com',
        tls: true,
        path: '',
      },
    })
    const withSimpleObfsResult = parseShadowsocksSIP002URI('ss://cmM0LW1kNTpwYXNzd2Q@us.proxy.com:8888/?plugin=obfs-local%3Bobfs%3Dhttp#Example2')
    expect(withSimpleObfsResult).toEqual({
      'type': 'ss',
      'name': 'Example2',
      'server': 'us.proxy.com',
      'cipher': 'rc4-md5',
      'password': 'passwd',
      'port': 8888,
      'plugin': 'obfs',
      'plugin-opt': {
        mode: 'http',
        host: '',
      },
    })
  })
  test('parseShadowsocksLegacyUri', () => {
    const result = parseShadowsocksLegacyUri('ss://cmM0LW1kNTp0ZXN0LyFAIzpAMTkyLjE2OC4xMDAuMTo4ODg4#Example1')
    expect(result).toEqual({
      type: 'ss',
      name: 'Example1',
      server: '192.168.100.1',
      cipher: 'rc4-md5',
      password: 'test/!@#',
      port: 8888,
    })
  })
  test('parseHttpProxy', () => {
    const nullResult = parseHttpUri('')
    expect(nullResult).toBeNull()
    const httpResult = parseHttpUri('http://user:password@192.168.1.2:8888#Example')
    expect(httpResult).toBeTruthy()
    expect(httpResult).toEqual({
      'type': 'http',
      'server': '192.168.1.2',
      'port': 8888,
      'username': 'user',
      'password': 'password',
      'name': 'Example',
      'skip-cert-verify': false,
      'tls': false,
    })
    const httpsResult = parseHttpUri('https://user:password@192.168.1.2:8888#Example')
    expect(httpsResult).toBeTruthy()
    expect(httpsResult).toEqual({
      'type': 'http',
      'server': '192.168.1.2',
      'port': 8888,
      'username': 'user',
      'password': 'password',
      'name': 'Example',
      'skip-cert-verify': false,
      'tls': true,
    })
  })

  test('parseSocksProxy', () => {
    const nullSocksResult = parseSocksUri('')
    expect(nullSocksResult).toBeNull()
    const socksResult = parseSocksUri('socks5://username:password@192.168.100.123:8000#Example')
    expect(socksResult).toEqual({
      'type': 'socks5',
      'name': 'Example',
      'server': '192.168.100.123',
      'port': 8000,
      'username': 'username',
      'password': 'password',
      'tls': false,
      'skip-cert-verify': false,
      'udp': true,
      'sni': '',
    })
  })

  test('parseTrojanProxy', () => {
    const emptyResult = parseTrojanUri('')
    expect(emptyResult).toBeNull()
    const originResult = parseTrojanUri('trojan://password1234@google.com:8443')
    expect(originResult).toEqual<OrdinaryTrojanProxy>({
      'type': 'trojan',
      'skip-cert-verify': false,
      'alpn': ['h2', 'http/1.1'],
      'name': 'google.com',
      'password': 'password1234',
      'port': 8443,
      'server': 'google.com',
      'udp': true,
    })
    const trojanResult = parseTrojanUri('trojan-go://password1234@google.com/?sni=microsoft.com&type=ws&host=youtube.com&path=%2Fgo&encryption=ss%3Baes-256-gcm%3Afuckgfw')
    expect(trojanResult).toEqual<TrojanWebsocketProxy>({
      'type': 'trojan',
      'name': 'google.com',
      'skip-cert-verify': false,
      'network': 'ws',
      'password': 'password1234',
      'server': 'google.com',
      'port': 443,
      'sni': 'microsoft.com',
      'udp': true,
      'ws-opts': {
        path: '/go',
        headers: {
          Host: 'youtube.com',
        },
      },
    })
  })
  test.todo('parseVmessProxy', () => {
  })
})
