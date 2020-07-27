package com.naver.wemo.controller;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.model;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration(locations = {"file:src/main/webapp/WEB-INF/spring/root-context.xml",
   									"file:src/main/webapp/WEB-INF/spring/appServlet/servlet-context.xml"})
public class PerformTestByJUnit {
	
	private static final Logger logger = LoggerFactory.getLogger(PerformTestByJUnit .class);
	
	@Autowired
	private WebApplicationContext wac;
	
	MockMvc mvc;

	@Before
	public void setup() {
		this.mvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
		logger.info("MockMvcBuilders.webAppContextSetut()");
	}
	
	@Test
	public void testLoginWeMo() throws Exception {
		logger.info("testLoginWeMo Started");
		try {
			mvc.perform(post("/IntoWeMo")
						.param("USER_EMAIL", "test6@test.com")
						.param("USER_PASS", "1234"))
			.andDo(print())
			.andExpect(status().isOk())
			.andExpect(model().attributeExists("USER_EMAIL"))
			.andExpect(view().name("WeMo_Main"));
			logger.info("testLoginWeMo Successed");
		} catch (Exception e) {
			logger.error("testLoginWeMo Failed :"+ e.getMessage());
		}
		
	}
	
	@Test
	public void testGetWeMoList() throws Exception {
		logger.info("testGetWeMoList Started");
		try {
			mvc.perform(post("/WeMolist")
						.param("USER_EMAIL", "g@gmail.com")
						.param("MEMO_SUB", "STUDY"))
			.andDo(print())
			.andExpect(status().isOk())
			.andExpect(model().attributeExists("WeMolist"))
			.andExpect(view().name("WeMo_Main"));
			logger.info("testGetWeMoList Successed");
		} catch (Exception e) {
			logger.error("testGetWeMoList Failed : " + e.getMessage());
		}
	}
	
	
}
