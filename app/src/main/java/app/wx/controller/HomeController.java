/**
 * Project Name:app 
 * Class Name:app.wx.controller.HomeController  
 * Date:2017年5月7日上午11:55:17 
 * Copyright (c) 2017, zhangxw All Rights Reserved. 
 */
package app.wx.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Enumeration;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import app.wx.constants.WechatConstants;
import zhangxw.utils.common.StringUtils;
import zhangxw.utils.encrypt.SHAEncryptUtils;

/**
 * @author zhangxw
 * TODO 一句话描述	
 * @Version 1.0
 * Date 2017-05-07 11:55:17 
 */

@RestController
@RequestMapping(value = {"/home", "/"})
public class HomeController {

	/**
	 * @Author zhangxw
	 * wechatValidate: 微信接入验证
	 * @return
	 */
	@RequestMapping(value = "", method = RequestMethod.GET)
	@ResponseBody
	public String wechatValidate(String signature, String timestamp, String nonce, String echostr, HttpServletResponse response) {
		if(StringUtils.isBlank(signature) && StringUtils.isBlank(timestamp) 
				&& StringUtils.isBlank(nonce) && StringUtils.isBlank(echostr)) {
			return "Hello Web";
		}
		
		List<String> list = new ArrayList<String>();
		list.add(nonce);
		list.add(timestamp);
		list.add(WechatConstants.token);
		System.out.println("list param" + list + " " + echostr + " " + signature);
		Collections.sort(list);
		StringBuilder sb = new StringBuilder();
		for (String e : list) {
			sb.append(e);
		}
		String message = SHAEncryptUtils.sha12Hex(sb.toString());
		System.out.println(message);
		if (message.equals(signature.toUpperCase())) {
			System.out.println("----------");
			PrintWriter writer = null;
			
			try {
				writer = response.getWriter();
				writer.print(echostr);
			} catch (IOException e1) {
				e1.printStackTrace();
			} finally {
				writer.close();
				writer = null;
			}
		}
		return null;
	}
	
	@RequestMapping(value = "", method = RequestMethod.POST)
	public Object getFromWechat(HttpServletRequest request, HttpServletResponse response) {
		Enumeration<String> headerNames = request.getHeaderNames();
		while(headerNames.hasMoreElements()) {
			String s = headerNames.nextElement();
			String header = request.getHeader(s);
			System.out.println(s + " == > " + header);
//			user-agent == > Mozilla/4.0
//			accept == > */*
//			host == > www.xiuxun.top
//			pragma == > no-cache
//			content-length == > 276
//			content-type == > text/xml
		}
		System.out.println("=======================");
		Map<String, String[]> parameterMap = request.getParameterMap();
		for(Entry<String, String[]> parameter : parameterMap.entrySet()) {
			String name = parameter.getKey();
			System.out.println(name);
			String[] value = parameter.getValue();
			for(String str : value)
				System.out.println(str);
			System.out.println("==========");
		}
		ServletInputStream in = null;
		InputStreamReader inReader = null;
		BufferedReader bufferedReader = null;
		try {
			StringBuilder sb = new StringBuilder();
			in = request.getInputStream();
			inReader = new InputStreamReader(in, Charset.forName("UTF-8"));
			bufferedReader = new BufferedReader(inReader);
			String s = "";
			while( (s = bufferedReader.readLine() ) != null ) {
				sb.append(s);
			}
			System.out.println(sb.toString());
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				bufferedReader.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
			try {
				inReader.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
			try {
				in.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return "";
	}
	
	
	// 9a93c4ee185f6b95d0889fdb2986914fa464d3de, 1494133561, weixinceshi ==> 8924894545077840893
	public static void main(String[] args) {
		HomeController hc = new HomeController();
		String s = hc.wechatValidate("595634086", "1494134637", "weixinceshi", "114467533409415021", null);
		System.out.println(s);
	}
	
}
