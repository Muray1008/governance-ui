import { useRouter } from 'next/router'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/outline'
import useProposal from '../../hooks/useProposal'
import StatusBadge from '../../components/StatusBadge'
import { ProposalStateLabels } from '../dao/[symbol]'
import TokenBalanceCard from '../../components/TokenBalanceCard'
import DiscussionPanel from '../../components/DiscussionPanel'
import VotePanel from '../../components/VotePanel'

const Proposal = () => {
  const router = useRouter()
  const { pk } = router.query

  const { proposal, instructions } = useProposal(pk as string)

  console.log('proposal data', { proposal, instructions })

  return (
    <div className="pb-10 pt-4">
      <Link href="/dao/MNGO">
        <a className="flex items-center text-fgd-3">
          <ArrowLeftIcon className="h-5 w-5 mr-1" />
          &nbsp; Back
        </a>
      </Link>
      <div className="pt-6">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-8 space-y-3">
            <div className="pb-4">
              <div className="pb-4">
                <h1 className="mb-1">{proposal?.info.name}</h1>
                <StatusBadge
                  status={ProposalStateLabels[proposal?.info.state]}
                />
              </div>
              <p>{proposal?.info.descriptionLink}</p>
              <span>{pk?.toString()}</span>
            </div>
            <DiscussionPanel />
            <VotePanel />
          </div>
          <div className="col-span-4">
            <TokenBalanceCard />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Proposal
