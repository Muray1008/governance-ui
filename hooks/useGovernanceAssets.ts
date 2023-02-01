import { GovernanceAccountType } from '@solana/spl-governance'
import { AccountType, AssetAccount } from '@utils/uiTypes/assets'
import { Instructions, PackageEnum } from '@utils/uiTypes/proposalCreationTypes'
import useGovernanceAssetsStore from 'stores/useGovernanceAssetsStore'
import useRealm from './useRealm'
import { vsrPluginsPks } from './useVotingPlugins'

type Package = {
  name: string
  image?: string
  isVisible?: boolean
}

type Packages = {
  [packageId in PackageEnum]: Package
}

type PackageType = Package & {
  id: PackageEnum
}

type Instruction = {
  name: string
  isVisible?: boolean
  packageId: PackageEnum
  assetType?: 'token' | 'mint' | 'wallet'
}

type InstructionsMap = {
  [instructionId in Instructions]: Instruction
}

export type InstructionType = {
  id: Instructions
  name: string
  packageId: PackageEnum
}

export default function useGovernanceAssets() {
  const { ownVoterWeight, realm, symbol, governances, config } = useRealm()

  const governedTokenAccounts: AssetAccount[] = useGovernanceAssetsStore(
    (s) => s.governedTokenAccounts
  )

  const assetAccounts = useGovernanceAssetsStore((s) =>
    s.assetAccounts.filter((x) => x.type !== AccountType.AuxiliaryToken)
  )
  const auxiliaryTokenAccounts = useGovernanceAssetsStore(
    (s) => s.assetAccounts
  ).filter((x) => x.type === AccountType.AuxiliaryToken)
  const currentPluginPk = config?.account.communityTokenConfig.voterWeightAddin
  const governancesArray = useGovernanceAssetsStore((s) => s.governancesArray)

  const getGovernancesByAccountType = (type: GovernanceAccountType) => {
    const governancesFiltered = governancesArray.filter(
      (gov) => gov.account?.accountType === type
    )
    return governancesFiltered
  }

  const getGovernancesByAccountTypes = (types: GovernanceAccountType[]) => {
    const governancesFiltered = governancesArray.filter((gov) =>
      types.some((t) => gov.account?.accountType === t)
    )
    return governancesFiltered
  }

  function canUseGovernanceForInstruction(types: GovernanceAccountType[]) {
    return (
      realm &&
      getGovernancesByAccountTypes(types).some((govAcc) =>
        ownVoterWeight.canCreateProposal(govAcc.account.config)
      )
    )
  }
  const canMintRealmCommunityToken = () => {
    const governances = getGovernancesByAccountTypes([
      GovernanceAccountType.MintGovernanceV1,
      GovernanceAccountType.MintGovernanceV2,
    ])
    return !!governances.find((govAcc) =>
      realm?.account.communityMint.equals(govAcc.account.governedAccount)
    )
  }
  const canMintRealmCouncilToken = () => {
    const governances = getGovernancesByAccountTypes([
      GovernanceAccountType.MintGovernanceV1,
      GovernanceAccountType.MintGovernanceV2,
    ])

    return !!governances.find(
      (x) =>
        x.account.governedAccount.toBase58() ==
        realm?.account.config.councilMint?.toBase58()
    )
  }
  const canUseTransferInstruction = governedTokenAccounts.some((acc) => {
    const governance = governancesArray.find(
      (x) => acc.governance.pubkey.toBase58() === x.pubkey.toBase58()
    )
    return (
      governance &&
      ownVoterWeight.canCreateProposal(governance?.account?.config)
    )
  })

  const canUseProgramUpgradeInstruction = canUseGovernanceForInstruction([
    GovernanceAccountType.ProgramGovernanceV1,
    GovernanceAccountType.ProgramGovernanceV2,
  ])

  const canUseMintInstruction = canUseGovernanceForInstruction([
    GovernanceAccountType.MintGovernanceV1,
    GovernanceAccountType.MintGovernanceV2,
  ])

  const canUseAnyInstruction =
    realm &&
    governancesArray.some((gov) =>
      ownVoterWeight.canCreateProposal(gov.account.config)
    )

  const realmAuth =
    realm &&
    governancesArray.find(
      (x) => x.pubkey.toBase58() === realm.account.authority?.toBase58()
    )
  const canUseAuthorityInstruction =
    realmAuth && ownVoterWeight.canCreateProposal(realmAuth?.account.config)

  const governedSPLTokenAccounts = governedTokenAccounts.filter(
    (x) => x.type === AccountType.TOKEN
  )
  const governedTokenAccountsWithoutNfts = governedTokenAccounts.filter(
    (x) => x.type !== AccountType.NFT
  )
  const governedNativeAccounts = governedTokenAccounts.filter(
    (x) => x.type === AccountType.SOL
  )
  const nftsGovernedTokenAccounts = governedTokenAccounts.filter(
    (govTokenAcc) =>
      govTokenAcc.type === AccountType.NFT ||
      govTokenAcc.type === AccountType.SOL
  )
  const canUseTokenTransferInstruction = governedTokenAccountsWithoutNfts.some(
    (acc) => {
      const governance = governancesArray.find(
        (x) => acc.governance.pubkey.toBase58() === x.pubkey.toBase58()
      )
      return (
        governance &&
        ownVoterWeight.canCreateProposal(governance?.account?.config)
      )
    }
  )

  // Alphabetical order
  // Images are in public/img/
  //
  // If an image is not set, then the name is displayed in the select
  // please use png with transparent background for logos
  //
  // Packages are visible by default
  const packages: Packages = {
    [PackageEnum.Castle]: {
      name: 'Castle',
      image: '/img/castle.png',
    },
    [PackageEnum.Common]: {
      name: 'Common',
    },
    [PackageEnum.Dual]: {
      name: 'Dual Finance',
      image: '/img/dual-logo.png',
    },
    [PackageEnum.Everlend]: {
      name: 'Everlend',
      image: '/img/everlend.png',
    },
    [PackageEnum.Foresight]: {
      name: 'Foresight',
      isVisible: symbol === 'FORE',
      image: '/img/foresight.png',
    },
    [PackageEnum.Friktion]: {
      name: 'Friktion',
      image: '/img/friktion.png',
    },
    [PackageEnum.GatewayPlugin]: {
      name: 'Gateway Plugin',
      image: '/img/civic.svg',
    },
    [PackageEnum.GoblinGold]: {
      name: 'Goblin Gold',
      image: '/img/goblingold.png',
    },
    [PackageEnum.Identity]: {
      name: 'Identity',
      image: '/img/identity.png',
    },
    [PackageEnum.NftPlugin]: {
      name: 'NFT Plugin',
    },
    [PackageEnum.MangoMarketV3]: {
      name: 'Mango Market v3',
      isVisible: symbol === 'MNGO',
      image: '/img/mango.png',
    },
    [PackageEnum.MangoMarketV4]: {
      name: 'Mango Market v4',
      image: '/img/mango.png',
    },
    [PackageEnum.MeanFinance]: {
      name: 'Mean Finance',
      image: '/img/meanfinance.png',
    },
    [PackageEnum.PsyFinance]: {
      name: 'PsyFinance',
      image: '/img/psyfinance.png',
    },
    [PackageEnum.Serum]: {
      name: 'Serum',
      image: '/img/serum.png',
      // Temporary:
      // Hide serum package for now, due to wallet disconnection bug
      isVisible: false,
    },
    [PackageEnum.Solend]: {
      name: 'Solend',
      image: '/img/solend.png',
    },
    [PackageEnum.Streamflow]: {
      name: 'Streamflow',
      image: '/img/streamflow.png',
    },
    [PackageEnum.Switchboard]: {
      name: 'Switchboard',
      image: '/img/switchboard.png',
    },
    [PackageEnum.VsrPlugin]: {
      name: 'Vsr Plugin',
    },
  }

  // Alphabetical order, Packages then instructions
  //
  // To generate package name comment, use:
  // https://patorjk.com/software/taag/#p=display&f=ANSI%20Regular&t=COMMON%0A
  //
  // If isVisible is not set, it is equal to canUseAnyInstruction
  const instructionsMap: InstructionsMap = {
    /*
       ██████  █████  ███████ ████████ ██      ███████
      ██      ██   ██ ██         ██    ██      ██
      ██      ███████ ███████    ██    ██      █████
      ██      ██   ██      ██    ██    ██      ██
       ██████ ██   ██ ███████    ██    ███████ ███████
    */

    [Instructions.DepositIntoCastle]: {
      name: 'Deposit into Vault',
      packageId: PackageEnum.Castle,
    },
    [Instructions.WithdrawFromCastle]: {
      name: 'Withdraw from Vault',
      packageId: PackageEnum.Castle,
    },

    /*
        ██████  ██████  ███    ███ ███    ███  ██████  ███    ██
       ██      ██    ██ ████  ████ ████  ████ ██    ██ ████   ██
       ██      ██    ██ ██ ████ ██ ██ ████ ██ ██    ██ ██ ██  ██
       ██      ██    ██ ██  ██  ██ ██  ██  ██ ██    ██ ██  ██ ██
        ██████  ██████  ██      ██ ██      ██  ██████  ██   ████
     */

    [Instructions.Base64]: {
      name: 'Execute Custom Instruction',
      packageId: PackageEnum.Common,
    },
    [Instructions.ChangeMakeDonation]: {
      name: 'Donation to Charity',
      packageId: PackageEnum.Common,
    },
    [Instructions.Clawback]: {
      name: 'Clawback',
      isVisible:
        canUseTokenTransferInstruction &&
        currentPluginPk &&
        vsrPluginsPks.includes(currentPluginPk.toBase58()),
      packageId: PackageEnum.Common,
    },
    [Instructions.CloseTokenAccount]: {
      name: 'Close token account',
      isVisible: canUseTransferInstruction,
      packageId: PackageEnum.Common,
    },
    [Instructions.CreateAssociatedTokenAccount]: {
      name: 'Create Associated Token Account',
      packageId: PackageEnum.Common,
    },
    [Instructions.CreateTokenMetadata]: {
      name: 'Create Token Metadata',
      isVisible: canUseAuthorityInstruction,
      packageId: PackageEnum.Common,
    },
    [Instructions.DeactivateValidatorStake]: {
      name: 'Deactivate validator stake',
      packageId: PackageEnum.Common,
    },
    [Instructions.DifferValidatorStake]: {
      name: 'Differ validator stake',
      // Not to be used for now
      isVisible: false,
      packageId: PackageEnum.Common,
    },
    [Instructions.Grant]: {
      name: 'Grant',
      isVisible:
        canUseTokenTransferInstruction &&
        currentPluginPk &&
        vsrPluginsPks.includes(currentPluginPk.toBase58()),
      packageId: PackageEnum.Common,
    },
    [Instructions.JoinDAO]: {
      name: 'Join a DAO',
      packageId: PackageEnum.Common,
    },
    [Instructions.Mint]: {
      name: 'Mint Tokens',
      isVisible: canUseMintInstruction,
      packageId: PackageEnum.Common,
    },
    [Instructions.None]: {
      name: 'None',
      isVisible:
        realm &&
        Object.values(governances).some((g) =>
          ownVoterWeight.canCreateProposal(g.account.config)
        ),
      packageId: PackageEnum.Common,
    },
    [Instructions.ProgramUpgrade]: {
      name: 'Upgrade Program',
      isVisible: canUseProgramUpgradeInstruction,
      packageId: PackageEnum.Common,
    },
    [Instructions.RealmConfig]: {
      name: 'Realm config',
      isVisible: canUseAuthorityInstruction,
      packageId: PackageEnum.Common,
    },
    [Instructions.StakeValidator]: {
      name: 'Stake A Validator',
      packageId: PackageEnum.Common,
    },
    [Instructions.Transfer]: {
      name: 'Transfer Tokens',
      isVisible: canUseTokenTransferInstruction,
      packageId: PackageEnum.Common,
    },
    [Instructions.TransferDomainName]: {
      name: 'SNS Transfer Out Domain Name',
      packageId: PackageEnum.Common,
    },
    [Instructions.UpdateTokenMetadata]: {
      name: 'Update Token Metadata',
      isVisible: canUseAuthorityInstruction,
      packageId: PackageEnum.Common,
    },
    [Instructions.WithdrawValidatorStake]: {
      name: 'Withdraw validator stake',
      packageId: PackageEnum.Common,
    },

    /*
      ██████  ██    ██  █████  ██          ███████ ██ ███    ██  █████  ███    ██  ██████ ███████
      ██   ██ ██    ██ ██   ██ ██          ██      ██ ████   ██ ██   ██ ████   ██ ██      ██
      ██   ██ ██    ██ ███████ ██          █████   ██ ██ ██  ██ ███████ ██ ██  ██ ██      █████
      ██   ██ ██    ██ ██   ██ ██          ██      ██ ██  ██ ██ ██   ██ ██  ██ ██ ██      ██
      ██████   ██████  ██   ██ ███████     ██      ██ ██   ████ ██   ██ ██   ████  ██████ ███████
    */

    [Instructions.DualFinanceStakingOption]: {
      name: 'Staking Option',
      isVisible: canUseTransferInstruction,
      packageId: PackageEnum.Dual,
    },
    [Instructions.DualFinanceExercise]: {
      name: 'Exercise',
      isVisible: canUseTransferInstruction,
      packageId: PackageEnum.Dual,
    },
    [Instructions.DualFinanceWithdraw]: {
      name: 'Withdraw',
      isVisible: canUseTransferInstruction,
      packageId: PackageEnum.Dual,
    },

    /*
      ███████ ██    ██ ███████ ██████  ██      ███████ ███    ██ ██████
      ██      ██    ██ ██      ██   ██ ██      ██      ████   ██ ██   ██
      █████   ██    ██ █████   ██████  ██      █████   ██ ██  ██ ██   ██
      ██       ██  ██  ██      ██   ██ ██      ██      ██  ██ ██ ██   ██
      ███████   ████   ███████ ██   ██ ███████ ███████ ██   ████ ██████
    */

    [Instructions.EverlendDeposit]: {
      name: 'Deposit Funds',
      packageId: PackageEnum.Everlend,
    },
    [Instructions.EverlendWithdraw]: {
      name: 'Withdraw Funds',
      packageId: PackageEnum.Everlend,
    },

    /*
      ███████  ██████  ██████  ███████ ███████ ██  ██████  ██   ██ ████████
      ██      ██    ██ ██   ██ ██      ██      ██ ██       ██   ██    ██
      █████   ██    ██ ██████  █████   ███████ ██ ██   ███ ███████    ██
      ██      ██    ██ ██   ██ ██           ██ ██ ██    ██ ██   ██    ██
      ██       ██████  ██   ██ ███████ ███████ ██  ██████  ██   ██    ██
    */

    [Instructions.ForesightAddMarketListToCategory]: {
      name: 'Add Market List To Category',
      packageId: PackageEnum.Foresight,
    },
    [Instructions.ForesightInitCategory]: {
      name: 'Init Category',
      packageId: PackageEnum.Foresight,
    },
    [Instructions.ForesightInitMarket]: {
      name: 'Init Market',
      packageId: PackageEnum.Foresight,
    },
    [Instructions.ForesightInitMarketList]: {
      name: 'Init Market List',
      packageId: PackageEnum.Foresight,
    },
    [Instructions.ForesightResolveMarket]: {
      name: 'Resolve Market',
      packageId: PackageEnum.Foresight,
    },
    [Instructions.ForesightSetMarketMetadata]: {
      name: 'Set Market Metadata',
      packageId: PackageEnum.Foresight,
    },

    /*
      ███████ ██████  ██ ██   ██ ████████ ██  ██████  ███    ██
      ██      ██   ██ ██ ██  ██     ██    ██ ██    ██ ████   ██
      █████   ██████  ██ █████      ██    ██ ██    ██ ██ ██  ██
      ██      ██   ██ ██ ██  ██     ██    ██ ██    ██ ██  ██ ██
      ██      ██   ██ ██ ██   ██    ██    ██  ██████  ██   ████
    */

    [Instructions.ClaimPendingDeposit]: {
      name: 'Claim Volt Tokens',
      packageId: PackageEnum.Friktion,
    },
    [Instructions.ClaimPendingWithdraw]: {
      name: 'Claim Pending Withdraw',
      packageId: PackageEnum.Friktion,
    },
    [Instructions.DepositIntoVolt]: {
      name: 'Deposit into Volt',
      packageId: PackageEnum.Friktion,
    },
    [Instructions.WithdrawFromVolt]: {
      name: 'Withdraw from Volt',
      packageId: PackageEnum.Friktion,
    },

    /*
       ██████   ██████  ██████  ██      ██ ███    ██  ██████   ██████  ██      ██████
      ██       ██    ██ ██   ██ ██      ██ ████   ██ ██       ██    ██ ██      ██   ██
      ██   ███ ██    ██ ██████  ██      ██ ██ ██  ██ ██   ███ ██    ██ ██      ██   ██
      ██    ██ ██    ██ ██   ██ ██      ██ ██  ██ ██ ██    ██ ██    ██ ██      ██   ██
       ██████   ██████  ██████  ███████ ██ ██   ████  ██████   ██████  ███████ ██████
    */

    [Instructions.DepositIntoGoblinGold]: {
      name: 'Deposit',
      packageId: PackageEnum.GoblinGold,
    },
    [Instructions.WithdrawFromGoblinGold]: {
      name: 'Withdraw',
      packageId: PackageEnum.GoblinGold,
    },

    /*
      ██ ██████  ███████ ███    ██ ████████ ██ ████████ ██    ██
      ██ ██   ██ ██      ████   ██    ██    ██    ██     ██  ██
      ██ ██   ██ █████   ██ ██  ██    ██    ██    ██      ████
      ██ ██   ██ ██      ██  ██ ██    ██    ██    ██       ██
      ██ ██████  ███████ ██   ████    ██    ██    ██       ██
    */

    [Instructions.ConfigureGatewayPlugin]: {
      name: 'Configure',
      isVisible: canUseAuthorityInstruction,
      packageId: PackageEnum.GatewayPlugin,
    },
    [Instructions.CreateGatewayPluginRegistrar]: {
      name: 'Create registrar',
      isVisible: canUseAuthorityInstruction,
      packageId: PackageEnum.GatewayPlugin,
    },
    [Instructions.AddKeyToDID]: {
      name: 'Add Key to DID',
      isVisible: canUseAnyInstruction,
      packageId: PackageEnum.Identity,
    },
    [Instructions.RemoveKeyFromDID]: {
      name: 'Remove Key from DID',
      isVisible: canUseAnyInstruction,
      packageId: PackageEnum.Identity,
    },
    [Instructions.AddServiceToDID]: {
      name: 'Add Service to DID',
      isVisible: canUseAnyInstruction,
      packageId: PackageEnum.Identity,
    },
    [Instructions.RemoveServiceFromDID]: {
      name: 'Remove Service from DID',
      isVisible: canUseAnyInstruction,
      packageId: PackageEnum.Identity,
    },

    /*
      ███    ██ ███████ ████████     ██████  ██      ██    ██  ██████  ██ ███    ██
      ████   ██ ██         ██        ██   ██ ██      ██    ██ ██       ██ ████   ██
      ██ ██  ██ █████      ██        ██████  ██      ██    ██ ██   ███ ██ ██ ██  ██
      ██  ██ ██ ██         ██        ██      ██      ██    ██ ██    ██ ██ ██  ██ ██
      ██   ████ ██         ██        ██      ███████  ██████   ██████  ██ ██   ████
    */

    [Instructions.ConfigureNftPluginCollection]: {
      name: 'Configure collection',
      isVisible: canUseAuthorityInstruction,
      packageId: PackageEnum.NftPlugin,
    },
    [Instructions.CreateNftPluginMaxVoterWeight]: {
      name: 'Create max voter weight',
      isVisible: canUseAuthorityInstruction,
      packageId: PackageEnum.NftPlugin,
    },
    [Instructions.CreateNftPluginRegistrar]: {
      name: 'Create registrar',
      isVisible: canUseAuthorityInstruction,
      packageId: PackageEnum.NftPlugin,
    },

    /*
      ███    ███  █████  ███    ██  ██████   ██████      ██    ██ ██████
      ████  ████ ██   ██ ████   ██ ██       ██    ██     ██    ██      ██
      ██ ████ ██ ███████ ██ ██  ██ ██   ███ ██    ██     ██    ██  █████
      ██  ██  ██ ██   ██ ██  ██ ██ ██    ██ ██    ██      ██  ██       ██
      ██      ██ ██   ██ ██   ████  ██████   ██████        ████   ██████
    */

    [Instructions.ClaimMangoTokens]: {
      name: 'Claim Tokens',
      isVisible: canUseTokenTransferInstruction,
      packageId: PackageEnum.MangoMarketV3,
    },
    [Instructions.DepositToMangoAccount]: {
      name: 'Deposit to mango account',
      isVisible: canUseTokenTransferInstruction,
      packageId: PackageEnum.MangoMarketV3,
    },
    [Instructions.DepositToMangoAccountCsv]: {
      name: 'Deposit to mango account with CSV',
      isVisible: canUseTokenTransferInstruction,
      packageId: PackageEnum.MangoMarketV3,
    },
    [Instructions.MangoAddOracle]: {
      name: 'Add Oracle',
      isVisible: canUseProgramUpgradeInstruction,
      packageId: PackageEnum.MangoMarketV3,
    },
    [Instructions.MangoAddSpotMarket]: {
      name: 'Add Spot Market',
      isVisible: canUseProgramUpgradeInstruction,
      packageId: PackageEnum.MangoMarketV3,
    },
    [Instructions.MangoChangeMaxAccounts]: {
      name: 'Change Max Accounts',
      isVisible: canUseProgramUpgradeInstruction,
      packageId: PackageEnum.MangoMarketV3,
    },
    [Instructions.MangoChangePerpMarket]: {
      name: 'Change Perp Market',
      isVisible: canUseProgramUpgradeInstruction,
      packageId: PackageEnum.MangoMarketV3,
    },
    [Instructions.MangoChangeQuoteParams]: {
      name: 'Change Quote Params',
      isVisible: canUseProgramUpgradeInstruction,
      packageId: PackageEnum.MangoMarketV3,
    },
    [Instructions.MangoChangeReferralFeeParams]: {
      name: 'Change Referral Fee Params',
      isVisible: canUseProgramUpgradeInstruction,
      packageId: PackageEnum.MangoMarketV3,
    },
    [Instructions.MangoChangeReferralFeeParams2]: {
      name: 'Change Referral Fee Params V2',
      isVisible: canUseProgramUpgradeInstruction,
      packageId: PackageEnum.MangoMarketV3,
    },
    [Instructions.MangoChangeSpotMarket]: {
      name: 'Change Spot Market',
      isVisible: canUseProgramUpgradeInstruction,
      packageId: PackageEnum.MangoMarketV3,
    },
    [Instructions.MangoCreatePerpMarket]: {
      name: 'Create Perp Market',
      isVisible: canUseProgramUpgradeInstruction,
      packageId: PackageEnum.MangoMarketV3,
    },
    [Instructions.MangoRemoveOracle]: {
      name: 'Remove Oracle',
      isVisible: canUseProgramUpgradeInstruction,
      packageId: PackageEnum.MangoMarketV3,
    },
    [Instructions.MangoRemovePerpMarket]: {
      name: 'Remove Perp Market',
      isVisible: canUseProgramUpgradeInstruction,
      packageId: PackageEnum.MangoMarketV3,
    },
    [Instructions.MangoRemoveSpotMarket]: {
      name: 'Remove Spot Market',
      isVisible: canUseProgramUpgradeInstruction,
      packageId: PackageEnum.MangoMarketV3,
    },
    [Instructions.MangoSetMarketMode]: {
      name: 'Set Market Mode',
      isVisible: canUseProgramUpgradeInstruction,
      packageId: PackageEnum.MangoMarketV3,
    },
    [Instructions.MangoSwapSpotMarket]: {
      name: 'Swap Spot Market',
      isVisible: canUseProgramUpgradeInstruction,
      packageId: PackageEnum.MangoMarketV3,
    },

    /*
      ███    ███  █████  ███    ██  ██████   ██████      ██    ██ ██   ██
      ████  ████ ██   ██ ████   ██ ██       ██    ██     ██    ██ ██   ██
      ██ ████ ██ ███████ ██ ██  ██ ██   ███ ██    ██     ██    ██ ███████
      ██  ██  ██ ██   ██ ██  ██ ██ ██    ██ ██    ██      ██  ██       ██
      ██      ██ ██   ██ ██   ████  ██████   ██████        ████        ██
    */

    [Instructions.MangoV4PerpCreate]: {
      name: 'Create Perp',
      packageId: PackageEnum.MangoMarketV4,
    },
    [Instructions.MangoV4PerpEdit]: {
      name: 'Edit Perp',
      packageId: PackageEnum.MangoMarketV4,
    },
    [Instructions.MangoV4OpenBookRegisterMarket]: {
      name: 'Register Openbook Market',
      packageId: PackageEnum.MangoMarketV4,
    },
    [Instructions.MangoV4TokenEdit]: {
      name: 'Edit Token',
      packageId: PackageEnum.MangoMarketV4,
    },
    [Instructions.MangoV4TokenRegister]: {
      name: 'Register Token',
      packageId: PackageEnum.MangoMarketV4,
    },
    [Instructions.MangoV4TokenRegisterTrustless]: {
      name: 'Register Trustless Token',
      packageId: PackageEnum.MangoMarketV4,
    },
    [Instructions.MangoV4GroupEdit]: {
      name: 'Edit Group',
      packageId: PackageEnum.MangoMarketV4,
    },
    [Instructions.MangoV4OpenBookEditMarket]: {
      name: 'Edit Openbook Market',
      packageId: PackageEnum.MangoMarketV4,
    },
    [Instructions.MangoV4IxGateSet]: {
      name: 'Enable/Disable individual instructions in Group',
      packageId: PackageEnum.MangoMarketV4,
    },
    [Instructions.MangoV4StubOracleCreate]: {
      name: 'Create Stub Oracle',
      packageId: PackageEnum.MangoMarketV4,
    },
    [Instructions.MangoV4StubOracleSet]: {
      name: 'Set Stub Oracle Value',
      packageId: PackageEnum.MangoMarketV4,
    },
    [Instructions.MangoV4AltSet]: {
      name: 'Set Address Lookup Table for Group',
      packageId: PackageEnum.MangoMarketV4,
    },
    [Instructions.MangoV4AltExtend]: {
      name: 'Extend Address Lookup Table',
      packageId: PackageEnum.MangoMarketV4,
    },
    [Instructions.MangoV4TokenAddBank]: {
      name: 'Add additional Bank to an existing Token',
      packageId: PackageEnum.MangoMarketV4,
    },
    /*
      ███    ███ ███████  █████  ███    ██     ███████ ██ ███    ██  █████  ███    ██  ██████ ███████
      ████  ████ ██      ██   ██ ████   ██     ██      ██ ████   ██ ██   ██ ████   ██ ██      ██
      ██ ████ ██ █████   ███████ ██ ██  ██     █████   ██ ██ ██  ██ ███████ ██ ██  ██ ██      █████
      ██  ██  ██ ██      ██   ██ ██  ██ ██     ██      ██ ██  ██ ██ ██   ██ ██  ██ ██ ██      ██
      ██      ██ ███████ ██   ██ ██   ████     ██      ██ ██   ████ ██   ██ ██   ████  ██████ ███████
    */

    [Instructions.MeanCreateAccount]: {
      name: 'Payment Stream: New account',
      packageId: PackageEnum.MeanFinance,
    },
    [Instructions.MeanFundAccount]: {
      name: 'Payment Stream: Fund account',
      packageId: PackageEnum.MeanFinance,
    },
    [Instructions.MeanWithdrawFromAccount]: {
      name: 'Payment Stream: Withdraw funds',
      packageId: PackageEnum.MeanFinance,
    },
    [Instructions.MeanCreateStream]: {
      name: 'Payment Stream: New stream',
      packageId: PackageEnum.MeanFinance,
    },
    [Instructions.MeanTransferStream]: {
      name: 'Payment Stream: Transfer stream',
      packageId: PackageEnum.MeanFinance,
    },

    /*
      ██████  ███████ ██    ██  ███████ ██ ███    ██  █████  ███    ██  ██████ ███████
      ██   ██ ██       ██  ██   ██      ██ ████   ██ ██   ██ ████   ██ ██      ██     
      ██████  ███████   ████    █████   ██ ██ ██  ██ ███████ ██ ██  ██ ██      █████  
      ██           ██    ██     ██      ██ ██  ██ ██ ██   ██ ██  ██ ██ ██      ██      
      ██      ███████    ██     ██      ██ ██   ████ ██   ██ ██   ████  ██████ ███████ 
    */

    [Instructions.PsyFinanceMintAmericanOptions]: {
      name: ' Mint American Options',
      packageId: PackageEnum.PsyFinance,
    },
    [Instructions.PsyFinanceBurnWriterForQuote]: {
      name: 'Claim Quote with Writer Token',
      packageId: PackageEnum.PsyFinance,
    },
    [Instructions.PsyFinanceClaimUnderlyingPostExpiration]: {
      name: 'Claim Underlying (post expiration)',
      packageId: PackageEnum.PsyFinance,
    },
    [Instructions.PsyFinanceExerciseOption]: {
      name: 'Exercise Option',
      packageId: PackageEnum.PsyFinance,
    },

    /*
      ███████ ███████ ██████  ██    ██ ███    ███
      ██      ██      ██   ██ ██    ██ ████  ████
      ███████ █████   ██████  ██    ██ ██ ████ ██
           ██ ██      ██   ██ ██    ██ ██  ██  ██
      ███████ ███████ ██   ██  ██████  ██      ██
    */

    [Instructions.SerumGrantLockedMSRM]: {
      name: 'Grant Locked MSRM',
      packageId: PackageEnum.Serum,
    },
    [Instructions.SerumGrantLockedSRM]: {
      name: 'Grant Locked SRM',
      packageId: PackageEnum.Serum,
    },
    [Instructions.SerumGrantVestMSRM]: {
      name: 'Grant Vested MSRM',
      packageId: PackageEnum.Serum,
    },
    [Instructions.SerumGrantVestSRM]: {
      name: 'Grant Vested SRM',
      packageId: PackageEnum.Serum,
    },
    [Instructions.SerumInitUser]: {
      name: 'Init User Account',
      packageId: PackageEnum.Serum,
    },
    [Instructions.SerumUpdateGovConfigAuthority]: {
      name: 'Update Governance Config Authority',
      packageId: PackageEnum.Serum,
    },
    [Instructions.SerumUpdateGovConfigParams]: {
      name: 'Update Governance Config Params',
      packageId: PackageEnum.Serum,
    },

    /*
      ███████  ██████  ██      ███████ ███    ██ ██████
      ██      ██    ██ ██      ██      ████   ██ ██   ██
      ███████ ██    ██ ██      █████   ██ ██  ██ ██   ██
           ██ ██    ██ ██      ██      ██  ██ ██ ██   ██
      ███████  ██████  ███████ ███████ ██   ████ ██████
    */

    [Instructions.CreateSolendObligationAccount]: {
      name: 'Create Obligation Account',
      packageId: PackageEnum.Solend,
    },
    [Instructions.DepositReserveLiquidityAndObligationCollateral]: {
      name: 'Deposit Funds',
      packageId: PackageEnum.Solend,
    },
    [Instructions.InitSolendObligationAccount]: {
      name: 'Init Obligation Account',
      packageId: PackageEnum.Solend,
    },
    [Instructions.RefreshSolendObligation]: {
      name: 'Refresh Obligation',
      packageId: PackageEnum.Solend,
    },
    [Instructions.RefreshSolendReserve]: {
      name: 'Refresh Reserve',
      packageId: PackageEnum.Solend,
    },
    [Instructions.WithdrawObligationCollateralAndRedeemReserveLiquidity]: {
      name: 'Withdraw Funds',
      packageId: PackageEnum.Solend,
    },

    /*
      ███████ ████████ ██████  ███████  █████  ███    ███ ███████ ██       ██████  ██     ██
      ██         ██    ██   ██ ██      ██   ██ ████  ████ ██      ██      ██    ██ ██     ██
      ███████    ██    ██████  █████   ███████ ██ ████ ██ █████   ██      ██    ██ ██  █  ██
           ██    ██    ██   ██ ██      ██   ██ ██  ██  ██ ██      ██      ██    ██ ██ ███ ██
      ███████    ██    ██   ██ ███████ ██   ██ ██      ██ ██      ███████  ██████   ███ ███
    */

    // [Instructions.CancelStream]: {
    //   name: 'Cancel Vesting Contract',
    //   packageId: PackageEnum.Streamflow,
    // },
    // [Instructions.CreateStream]: {
    //   name: 'Create Vesting Contract',
    //   packageId: PackageEnum.Streamflow,
    // },

    /*
      ███████ ██     ██ ██ ████████  ██████ ██   ██ ██████   ██████   █████  ██████  ██████
      ██      ██     ██ ██    ██    ██      ██   ██ ██   ██ ██    ██ ██   ██ ██   ██ ██   ██
      ███████ ██  █  ██ ██    ██    ██      ███████ ██████  ██    ██ ███████ ██████  ██   ██
           ██ ██ ███ ██ ██    ██    ██      ██   ██ ██   ██ ██    ██ ██   ██ ██   ██ ██   ██
      ███████  ███ ███  ██    ██     ██████ ██   ██ ██████   ██████  ██   ██ ██   ██ ██████
    */

    [Instructions.SwitchboardAdmitOracle]: {
      name: 'Admit Oracle to Queue',
      packageId: PackageEnum.Switchboard,
    },
    [Instructions.SwitchboardRevokeOracle]: {
      name: 'Remove Oracle from Queue',
      packageId: PackageEnum.Switchboard,
    },

    /*
      ██    ██ ███████ ██████      ██████  ██      ██    ██  ██████  ██ ███    ██
      ██    ██ ██      ██   ██     ██   ██ ██      ██    ██ ██       ██ ████   ██
      ██    ██ ███████ ██████      ██████  ██      ██    ██ ██   ███ ██ ██ ██  ██
       ██  ██       ██ ██   ██     ██      ██      ██    ██ ██    ██ ██ ██  ██ ██
        ████   ███████ ██   ██     ██      ███████  ██████   ██████  ██ ██   ████
    */

    [Instructions.CreateVsrRegistrar]: {
      name: 'Vote Escrowed Tokens: Create Registrar',
      isVisible: canUseAuthorityInstruction,
      packageId: PackageEnum.VsrPlugin,
    },
    [Instructions.VotingMintConfig]: {
      name: 'Vote Escrowed Tokens: Configure Voting Mint',
      isVisible: canUseAuthorityInstruction,
      packageId: PackageEnum.VsrPlugin,
    },
  }

  const availablePackages: PackageType[] = Object.entries(packages)
    .filter(([, { isVisible }]) =>
      typeof isVisible === 'undefined' ? true : isVisible
    )
    .map(([id, infos]) => ({
      id: Number(id) as PackageEnum,
      ...infos,
    }))

  const availableInstructions = Object.entries(instructionsMap)
    .filter(([, { isVisible, packageId }]) => {
      // do not display if the instruction's package is not visible
      if (!availablePackages.some(({ id }) => id === packageId)) {
        return false
      }

      return typeof isVisible === 'undefined' ? canUseAnyInstruction : isVisible
    })
    .map(([id, { name, packageId }]) => ({
      id: Number(id) as Instructions,
      name,
      packageId,
    }))

  const getPackageTypeById = (packageId: PackageEnum) => {
    return availablePackages.find(
      (availablePackage) => availablePackage.id === packageId
    )
  }

  return {
    assetAccounts,
    auxiliaryTokenAccounts,
    availableInstructions,
    availablePackages,
    canMintRealmCommunityToken,
    canMintRealmCouncilToken,
    canUseAuthorityInstruction,
    canUseMintInstruction,
    canUseProgramUpgradeInstruction,
    canUseTransferInstruction,
    getGovernancesByAccountType,
    getGovernancesByAccountTypes,
    getPackageTypeById,
    governancesArray,
    governedNativeAccounts,
    governedSPLTokenAccounts,
    governedTokenAccounts,
    governedTokenAccountsWithoutNfts,
    nftsGovernedTokenAccounts,
  }
}
