import React, { useEffect } from 'react'
import { Input } from '@/components/io/input'

const Test = () => {
  // useEffect(() => {
  //   // input.setState((prev) => ({ ...prev, test1: '22' }))
  //   setTimeout(() => {
  //     console.log('this component is rendered', input)
  //   }, 10000)
  // }, [])

  // useEffect(() => {
  //   console.log('input.state.test1', input)
  // }, [input])

  useEffect(() => {
    // input.set.test1('123123534534')
  }, [])

  return (
    <div>
      {/*<Input.Labeled*/}
      {/*  label='테스트1'*/}
      {/*  name='test1'*/}
      {/*  value={input}*/}
      {/*  onChange={(name, value) => {*/}
      {/*    // input.setState((prev) => ({ ...prev, [name]: value }))*/}
      {/*    console.log('name:', name, ', value:', value)*/}
      {/*  }}*/}
      {/*/>*/}
      {/*<Input.Labeled*/}
      {/*  label='테스트2'*/}
      {/*  name='test2'*/}
      {/*  value={input}*/}
      {/*  onChange={(name, value) => {*/}
      {/*    // input.setState((prev) => ({ ...prev, [name]: value }))*/}
      {/*    // setState((prev) => ({ ...prev, [name]: value }))*/}
      {/*    console.log('name:', name, ', value:', value)*/}
      {/*  }}*/}
      {/*/>*/}
    </div>
  )
}

export default Test
