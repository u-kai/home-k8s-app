package pkg

// どうやって他の要素と結びつけるか
// sentence側でimage_idを持つ方法だと、imageが複数の場合やimageがない場合には非正規化が発生する
// もしくはsentence_id,image_dataの組み合わせで持つこともありだが、これって実質image側がsentence_idを持っているのと同じことになる
// なので、image側でsentence_idを持つのが良いかもしれない
// 他のwordとかdiaryとか他に同じようなものが出ても対応することができる
// imageが他の要素に依存することにはなるけど、他の要素がimageに依存することはないので、image側で持つのが良いかもしれない
// imageの方がドメイン的には薄いので、他の要素が依存しない形にする方がいいのではないか

// sentence_image table schema
//
// image_id VARCHAR(255) PRIMARY KEY,
// sentence_id VARCHAR(255) NOT NULL FOREIGN KEY,
// user_id VARCHAR(255) NOT NULL,
// image_url TEXT NOT NULL,
// height INT NOT NULL,
// width INT NOT NULL,
// created_at BIGINT NOT NULL,
// updated_at BIGINT NOT NULL,

// diary_image table schema
//
// image_id VARCHAR(255) PRIMARY KEY,
// diary_id VARCHAR(255) NOT NULL FOREIGN KEY,
// user_id VARCHAR(255) NOT NULL,
// image_url TEXT NOT NULL,
// height INT NOT NULL,
// width INT NOT NULL,
// created_at BIGINT NOT NULL,
// updated_at BIGINT NOT NULL,
