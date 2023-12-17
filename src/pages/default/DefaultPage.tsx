import React from "react";
import styles from "./DefaultPage.module.scss";
import TextArea from "antd/lib/input/TextArea";
import { Button, Card, Form, Input, Layout, Switch } from "antd";
import { useCreation } from "ahooks";
import { DefaultPageBloc } from "@pages/default/DefaultPageBloc";

const { Header, Sider, Content } = Layout;

export function DefaultPage(props: {}): React.JSX.Element {
  const bloc = useCreation(() => new DefaultPageBloc(), []);

  return (
    <div className={styles.page}>
      <Layout className={styles.layout}>
        <Header className={styles.header}>{"JSON 转换 TypeScript"}</Header>
        <Layout hasSider className={styles.layoutSider}>
          <Content className={styles.content}>
            <TextArea
              rows={10}
              placeholder={"输入 JSON"}
              className={styles.textarea}
              value={bloc.state.value.jsonInput}
              onChange={e => bloc.handleInputChange(e)}
            />
          </Content>
          <Sider width={20} className={styles.siderSpace}></Sider>
          <Content className={styles.content}>
            <TextArea
              rows={10}
              placeholder={"结果 TypeScript"}
              className={styles.textarea}
              value={bloc.state.value.resultOutput}
            />
          </Content>
          <Sider width={20} className={styles.siderSpace}></Sider>
          <Sider width={340} className={styles.sider}>
            <Card className={styles.card}>
              <Form labelCol={{ span: 8 }} layout="horizontal">
                <Form.Item label="使用构造函数">
                  <Switch
                    value={bloc.state.value.options.optionalFields}
                    onChange={e => bloc.handleOptionalFieldsChange(e)}
                  />
                </Form.Item>
                <Form.Item label="可选字段">
                  <Switch
                    value={bloc.state.value.options.optionalFields}
                    onChange={e => bloc.handleOptionalFieldsChange(e)}
                  />
                </Form.Item>
                <Form.Item label="按字母排序">
                  <Switch
                    value={bloc.state.value.options.sortAlphabetically}
                    onChange={e => bloc.handleSortAlphabeticallyChange(e)}
                  />
                </Form.Item>
                <Form.Item label="类名">
                  <Input
                    placeholder=""
                    value={bloc.state.value.options.rootObjectName}
                    onChange={e => bloc.handleRootObjectNameChange(e)}
                  />
                </Form.Item>
                <Form.Item label="&nbsp;" noStyle={false}>
                  <Button type="primary" onClick={() => bloc.transform()}>
                    生成
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Sider>
        </Layout>
      </Layout>
    </div>
  );
}
