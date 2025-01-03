// fn main() {
//     let a = Box::new(1);
//     let b = a;
//     // *b += 1;

//     println!("{}", a);
// }


fn move_a_box(b: Box<i32>) {
  // This space intentionally left blank
}

fn main() {
let b = Box::new(0);
let b2 = b;
move_a_box(b);
}