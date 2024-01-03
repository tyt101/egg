import React, { useCallback, useState, useRef } from "react";

import s from './style.module.less'
import CustomIcon from "@/components/CustomIcon";
import {
  Cell,
  Button,
  Switch,
  Toast
} from 'zarm'
import { Input } from 'zarm';
import Captcha from 'react-captcha-code'
import { InitType, LangType } from "@/Enums";
import { post } from '@/utils'
import { useTranslation } from "react-i18next";
const Login = () => {
  const { t, i18n} = useTranslation()
  const captchaRef = useRef()
  const [checked, setChecked] = useState(InitType.LOGIN)
  const [lang, setLang] = useState(localStorage.getItem('EGG-Language') == 'cn' ? LangType.CN : LangType.EN)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [verify, setVerify] = useState('')
  const [captcha, setCaptcha] = useState('')
  const handleChange = useCallback((captcha) => {
    setCaptcha(captcha)
  }, [])
  const submit = async() => {
    // front verify
    if (!username) {
      Toast.show(t('请输入账号'))
      return
    }
    if (!password) {
      Toast.show(t('请输入密码'))
      return
    }
    
    try {
      if(checked === InitType.LOGIN) {
        const { data } = await post('/api/user/login', {
          username,
          password
        });
        localStorage.setItem('EGG_TOKEN', data.token)
        Toast.show('登录成功');
      } else {
        if (!verify) {
          Toast.show('请输入验证码')
          return
        }
        if (verify != captcha) {
          Toast.show('验证码错误')
          return
        }
        const { data } = await post('/api/user/register', {
          username,
          password
        });
        Toast.show('注册成功', data);
      }
    } catch (error) {
      Toast.show('系统错误',error);
    }
  }
  const clearForm = () => {
    setCaptcha('')
    setVerify('')
    setPassword('')
    setUsername('')
  }
  const handleCheckedChange = () => {
    setChecked(!checked)
    clearForm()
  }

  const handleSetLanguage = () => {
    setLang(!lang)
    localStorage.setItem('EGG-Language', LangType.CN == !lang ? 'cn': 'en')
    i18n.changeLanguage(localStorage.getItem('EGG-Language'))
  }
  return <div className={s.auth}>
    <div className={s.header}>
      <div className={s.title}>{t("账本")}</div>
      <div className={s.head}>
        <Switch className={s.switch} checked={checked} onChange={handleCheckedChange}>
        </Switch>
        <div className={s.gap}>{checked == InitType.REGISTER ? t("注册") : t("登录")}</div>
      </div>
    </div>
    <div className={s.form}>
      <Cell icon={<CustomIcon type="icon-zhanghao" />}>
        <Input clearable type="text" placeholder={t("请输入账号")} value={username} onChange={(v) => setUsername(v)} />
      </Cell>
      <Cell icon={<CustomIcon type="icon-mima" />}>
        <Input clearable type="password" placeholder={t("请输入密码")} value={password} onChange={(v) => setPassword(v)} />
      </Cell>
      <>
      {checked == InitType.REGISTER ? <Cell icon={<CustomIcon type="icon-yanzhengma" />}>
        <Input clearable type="text" placeholder={t("请输入验证码")} value={verify} onChange={(v) => setVerify(v)} />
        <Captcha ref={captchaRef} charNum={4} onChange={handleChange} />
      </Cell> : ''}
      </>
      <div className={s.operator}>
        <Button onClick={submit}>{checked == InitType.REGISTER ? t("注册") : t("登录")}</Button>
        <div className={s.switch_change}>
          <Switch className={s.switch} checked={lang} onChange={handleSetLanguage}>
          </Switch>
          <span>{lang === LangType.CN ? '中' : 'En'}</span>
        </div>
      </div>
    </div>
    
    <div className={s.bottom}>
      <div className={s.line}></div>
      CODE BY TYT101 | <a href="https://github.com/tyt101/egg">GITHUB ADDRESS</a>
    </div>
  </div>
}

export default Login