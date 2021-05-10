import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';
import { CombinedRule } from 'app/types/unified-alerting';
import { PromAlertingRuleState } from 'app/types/unified-alerting-dto';
import { capitalize } from 'lodash';
import React, { FC, useState } from 'react';
import { CollapseToggle } from '../CollapseToggle';
import { RulesTable } from './RulesTable';

interface Props {
  rules: CombinedRule[];
  state: PromAlertingRuleState;
  defaultCollapsed?: boolean;
}

export const RuleListStateSection: FC<Props> = ({ rules, state, defaultCollapsed = false }) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const styles = useStyles2(getStyles);
  return (
    <>
      <h4 className={styles.header}>
        <CollapseToggle
          className={styles.collapseToggle}
          size="xxl"
          isCollapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
        {capitalize(state)} ({rules.length})
      </h4>
      {!collapsed && <RulesTable className={styles.rulesTable} rules={rules} showGroupColumn={true} />}
    </>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  collapseToggle: css`
    vertical-align: middle;
  `,
  header: css`
    margin-top: ${theme.spacing(2)};
  `,
  rulesTable: css`
    margin-top: ${theme.spacing(3)};
  `,
});
