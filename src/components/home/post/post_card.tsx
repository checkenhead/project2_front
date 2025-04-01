import '@/styles/post.scss'
import { Flex } from '@/components/layout/flex'
import { Card } from '@/components/layout/card'
import Icon from '@/components/common/icon'
import { useMemo, useState } from 'react'
import { getClassNames } from '@/utils/common'

export const PostCard = () => {
  return (
    <div
      className={'post_card_box'}
      style={{
        width: '90%',
        // border: '1px solid black',
        // borderRadius: '0.5rem',
        // padding: '0.5rem',
        // margin: '1rem',
        margin: '1rem',
      }}
    >
      <Flex.Col.Center padding='0.5rem' gap='0.5rem'>
        <Card.Title>content title</Card.Title>
        <Card.Text>
          Lorem ipsum dolor sit amet, ne eam alii perfecto adipisci. No pri veniam veritus, has nusquam iracundia ei,
          constituto philosophia intellegebat vix ad. Cum stet conclusionemque no, mea cu justo assentior scriptorem. Cu
          nec minimum euripidis, eam appetere fabellas ne, no mentitum partiendo est. Vix at dolorem sententiae
          dissentias. Eos assum ridens fastidii cu. Qui id reque legere reprimique, etiam veritus imperdiet qui te. Pri
          quando semper cetero id, aperiam concludaturque ea duo, sit id quem appellantur neglegentur. Omnes decore
          ornatus cu eum. Mei movet abhorreant mnesarchum ut, an per hinc zril. Ea veri mucius usu, an mei vocent
          utroque efficiendi. Quo et fugit
        </Card.Text>
      </Flex.Col.Center>

      <hr />
      <Card.Section padding='0.5rem'>
        <Icon type='user' size='2rem' />
      </Card.Section>
    </div>
  )
}
