import { useEffect, useMemo } from 'react'

import { WalletAdapter } from '../@types/types'
import useWalletStore from '../stores/useWalletStore'
import { notify } from '../utils/notifications'
import {
  DEFAULT_PROVIDER,
  getWalletProviderByUrl,
} from '../utils/wallet-adapters'

import useInterval from './useInterval'
import useLocalStorageState from './useLocalStorageState'
import usePool from './usePool'

const SECONDS = 1000

export default function useWallet() {
  const {
    connected,
    connection: { endpoint },
    current: wallet,
    providerUrl: selectedProviderUrl,
    set: setWalletStore,
    actions,
  } = useWalletStore((state) => state)

  const { endIdo } = usePool()
  const [savedProviderUrl, setSavedProviderUrl] = useLocalStorageState(
    'walletProvider',
    DEFAULT_PROVIDER.url
  )
  const provider = useMemo(() => getWalletProviderByUrl(selectedProviderUrl), [
    selectedProviderUrl,
  ])

  useEffect(() => {
    if (selectedProviderUrl && selectedProviderUrl != savedProviderUrl) {
      setSavedProviderUrl(selectedProviderUrl)
    }
  }, [selectedProviderUrl])

  useEffect(() => {
    if (provider) {
      const updateWallet = () => {
        // hack to also update wallet synchronously in case it disconnects
        const wallet = new provider.adapter(
          provider.url,
          endpoint
        ) as WalletAdapter
        setWalletStore((state) => {
          state.current = wallet
        })
      }

      if (document.readyState !== 'complete') {
        // wait to ensure that browser extensions are loaded
        const listener = () => {
          updateWallet()
          window.removeEventListener('load', listener)
        }
        window.addEventListener('load', listener)
        return () => window.removeEventListener('load', listener)
      } else {
        updateWallet()
      }
    }
  }, [provider, endpoint])

  useEffect(() => {
    if (!wallet) return
    wallet.on('connect', async () => {
      setWalletStore((state) => {
        state.connected = true
      })
      notify({
        message: 'Wallet connected',
        description:
          'Connected to wallet ' +
          wallet.publicKey.toString().substr(0, 5) +
          '...' +
          wallet.publicKey.toString().substr(-5),
      })
      await actions.fetchPool()
      await actions.fetchWalletTokenAccounts()
    })
    wallet.on('disconnect', () => {
      setWalletStore((state) => {
        state.connected = false
        state.tokenAccounts = []
      })
      notify({
        type: 'info',
        message: 'Disconnected from wallet',
      })
    })
    return () => {
      wallet?.disconnect?.()
      setWalletStore((state) => {
        state.connected = false
      })
    }
  }, [wallet])

  // fetch pool on page load
  useEffect(() => {
    const pageLoad = async () => {
      await actions.fetchPool()
      actions.fetchMints()
    }
    pageLoad()
  }, [])

  // refresh usdc vault regularly
  useInterval(async () => {
    if (endIdo.isAfter()) {
      await actions.fetchUsdcVault()
    } else {
      await actions.fetchMNGOVault()
      await actions.fetchRedeemableMint()
    }
  }, 10 * SECONDS)

  return { connected, wallet }
}
