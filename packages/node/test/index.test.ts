import test from 'ava';
import { Node } from '../src/';
import { Constants } from '~/suite-utils';

test('Connect devnet', (t) => {
  Node.changeConnection({ cluster: Constants.Cluster.dev });
  const res = Node.getConnection();
  t.not(res, '');
  t.is(
    res.rpcEndpoint,
    Constants.switchCluster({ cluster: Constants.Cluster.dev }),
  );
});

test('Connect mainnet', (t) => {
  Node.changeConnection({ cluster: Constants.Cluster.prd });
  const res = Node.getConnection();
  t.not(res, '');
  t.is(
    res.rpcEndpoint,
    Constants.switchCluster({ cluster: Constants.Cluster.prd }),
  );
});

test('Connect devnet for localhost', (t) => {
  Node.changeConnection({ cluster: Constants.Cluster.localhost });
  const res = Node.getConnection();
  t.not(res, '');
  t.is(
    res.rpcEndpoint,
    Constants.switchCluster({ cluster: Constants.Cluster.localhost }),
  );
});

test('Connect devnet for localhost by default no parameter', (t) => {
  const res = Node.getConnection();
  t.not(res, '');
  t.is(
    res.rpcEndpoint,
    Constants.switchCluster({ cluster: Constants.Cluster.localhost }),
  );
});

test('Connect devnet and modified commitment', (t) => {
  Node.changeConnection({
    cluster: Constants.Cluster.dev,
    commitment: 'confirmed',
  });
  const res = Node.getConnection();
  t.not(res, '');
  t.is(
    res.rpcEndpoint,
    Constants.switchCluster({ cluster: Constants.Cluster.dev }),
  );
});

test('Change cluster destination, check singleton object', (t) => {
  const res = Node.getConnection().rpcEndpoint;
  Node.changeConnection({ cluster: Constants.Cluster.prd });
  const res2nd = Node.getConnection().rpcEndpoint;
  t.not(res, res2nd);
  const res3rd = Node.getConnection().rpcEndpoint;
  t.is(res2nd, res3rd);
});

test('Change custom cluster url', (t) => {
  const customClusterUrl = ['https://dummy-solana-devnet.url'];
  const before = Node.getConnection().rpcEndpoint;
  t.log('# default clsuter url: ', before);
  Node.changeConnection({
    customClusterUrl,
  });
  const after = Node.getConnection().rpcEndpoint;
  t.log('# default clsuter url: ', after);
  t.is(after, customClusterUrl[0]);
});

test('Change custom cluster urls', (t) => {
  const customClusterUrl = [
    'https://dummy-solana-devnet.url',
    'https://dummy2-solana-devnet.url',
    'https://dummy3-solana-devnet.url',
  ];
  const before = Node.getConnection().rpcEndpoint;
  t.log('# default clsuter url: ', before);
  Node.changeConnection({
    customClusterUrl,
  });
  const after = Node.getConnection().rpcEndpoint;
  t.log('# default clsuter url: ', after);
  t.regex(customClusterUrl.join(''), new RegExp(after));
});

test('Change commitment, check singleton object', (t) => {
  const res = Node.getConnection().commitment;
  Node.changeConnection({
    commitment: 'finalized',
  });
  const res2nd = Node.getConnection().commitment;
  t.not(res, res2nd);
  const res3rd = Node.getConnection().commitment;
  t.is(res2nd, res3rd);
});

test('Change commitment destination, check singleton object', (t) => {
  const res = Node.getConnection().commitment;
  Node.changeConnection({
    cluster: Constants.Cluster.prd,
    commitment: 'confirmed',
  });
  const res2nd = Node.getConnection().commitment;
  t.not(res, res2nd);
  const res3rd = Node.getConnection().commitment;
  t.is(res2nd, res3rd);
});
