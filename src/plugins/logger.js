// Credits: borrowed code from fcomb/redux-logger

import { deepCopy } from '../util'
// vuex提供了默认的logger插件
export default function createLogger ({
  // 是否折叠打印的logger
  collapsed = true,
  // 是否过滤打印的mutation
  filter = (mutation, stateBefore, stateAfter) => true,
  // 在开始记录之前转换状态
  transformer = state => state,
  // mutation 按照 { type, payload } 格式记录
  // 我们可以按任意方式格式化
  mutationTransformer = mut => mut,
  logger = console
} = {}) {
  // vuex插件可以获取到store实例
  return store => {
    // 对store。state进行深拷贝
    let prevState = deepCopy(store.state)
    // 订阅mutation的改变
    // subscribe会在每次mutation提交后执行
    store.subscribe((mutation, state) => {
      if (typeof logger === 'undefined') {
        return
      }
      // 拷贝变化后的state
      const nextState = deepCopy(state)
      // 我们可以重写filter函数来过滤是否打印mutation
      if (filter(mutation, prevState, nextState)) {
        // 构建打印的时间
        const time = new Date()
        const formattedTime = ` @ ${pad(time.getHours(), 2)}:${pad(time.getMinutes(), 2)}:${pad(time.getSeconds(), 2)}.${pad(time.getMilliseconds(), 3)}`
        // 对mutation格式进行格式化
        const formattedMutation = mutationTransformer(mutation)
        const message = `mutation ${mutation.type}${formattedTime}`
        // 是否折叠信息
        const startMessage = collapsed
          ? logger.groupCollapsed
          : logger.group
        // 开始打印
        // render
        try {
          startMessage.call(logger, message)
        } catch (e) {
          console.log(message)
        }

        logger.log('%c prev state', 'color: #9E9E9E; font-weight: bold', transformer(prevState))
        logger.log('%c mutation', 'color: #03A9F4; font-weight: bold', formattedMutation)
        logger.log('%c next state', 'color: #4CAF50; font-weight: bold', transformer(nextState))

        try {
          logger.groupEnd()
        } catch (e) {
          logger.log('—— log end ——')
        }
      }

      prevState = nextState
    })
  }
}

function repeat (str, times) {
  return (new Array(times + 1)).join(str)
}

function pad (num, maxLength) {
  return repeat('0', maxLength - num.toString().length) + num
}
